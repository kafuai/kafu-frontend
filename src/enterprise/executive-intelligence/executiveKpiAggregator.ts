import type {
  SalesIntelligenceSnapshot,
  SalesOpportunity,
} from "../sales-intelligence/salesIntelligenceTypes";

import type {
  ExecutiveHealthStatus,
  ExecutiveKpi,
  ExecutiveKpiPriority,
  ExecutiveTrendDirection,
} from "./executiveKpiTypes";

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function formatCurrency(
  value: number,
  currency: string,
): string {
  return new Intl.NumberFormat("ar-BH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function resolveStatus(
  value: number,
  healthyThreshold: number,
  attentionThreshold: number,
  higherIsBetter = true,
): ExecutiveHealthStatus {
  if (higherIsBetter) {
    if (value >= healthyThreshold) {
      return "healthy";
    }

    if (value >= attentionThreshold) {
      return "attention";
    }

    return "critical";
  }

  if (value <= healthyThreshold) {
    return "healthy";
  }

  if (value <= attentionThreshold) {
    return "attention";
  }

  return "critical";
}

function resolveTrend(
  status: ExecutiveHealthStatus,
): ExecutiveTrendDirection {
  if (status === "healthy") {
    return "up";
  }

  if (status === "critical") {
    return "down";
  }

  return "neutral";
}

function resolvePriority(
  status: ExecutiveHealthStatus,
): ExecutiveKpiPriority {
  if (status === "critical") {
    return "critical";
  }

  if (status === "attention") {
    return "high";
  }

  return "medium";
}

function getWinRate(
  opportunities: SalesOpportunity[],
): number {
  const won = opportunities.filter(
    (opportunity) => opportunity.status === "won",
  ).length;

  const lost = opportunities.filter(
    (opportunity) => opportunity.status === "lost",
  ).length;

  const closed = won + lost;

  return closed > 0 ? won / closed : 0;
}

function getOpportunityHealthRatio(
  opportunities: SalesOpportunity[],
): number {
  const active = opportunities.filter(
    (opportunity) =>
      opportunity.status !== "won" &&
      opportunity.status !== "lost",
  );

  if (!active.length) {
    return 1;
  }

  const healthy = active.filter(
    (opportunity) => opportunity.health === "healthy",
  ).length;

  return healthy / active.length;
}

function getExecutionReadiness(
  opportunities: SalesOpportunity[],
): number {
  const active = opportunities.filter(
    (opportunity) =>
      opportunity.status !== "won" &&
      opportunity.status !== "lost",
  );

  if (!active.length) {
    return 1;
  }

  const ready = active.filter(
    (opportunity) =>
      Boolean(opportunity.nextAction?.trim()) &&
      Boolean(opportunity.nextActionDueAt),
  ).length;

  return ready / active.length;
}

export interface ExecutiveKpiAggregation {
  kpis: ExecutiveKpi[];
  revenueAttainment: number;
  forecastConfidence: number;
  weightedCoverage: number;
  winRate: number;
  opportunityHealthRatio: number;
  executionReadiness: number;
}

export function aggregateExecutiveKpis(
  snapshot: SalesIntelligenceSnapshot,
): ExecutiveKpiAggregation {
  const generatedAt = snapshot.generatedAt;
  const currency = snapshot.currency;
  const revenue = snapshot.revenue.summary;

  const revenueAttainment = clampRatio(
    revenue.quotaAttainment,
  );

  const forecastConfidence = clampRatio(
    revenue.forecastConfidence,
  );

  const weightedCoverage = Math.max(
    0,
    revenue.weightedCoverage,
  );

  const winRate = getWinRate(snapshot.opportunities);

  const opportunityHealthRatio =
    getOpportunityHealthRatio(snapshot.opportunities);

  const executionReadiness =
    getExecutionReadiness(snapshot.opportunities);

  const openRevenueRisks = revenue.riskSignals.filter(
    (signal) => signal.status === "open",
  ).length;

  const criticalOpportunities = snapshot.opportunities.filter(
    (opportunity) =>
      opportunity.status !== "won" &&
      opportunity.status !== "lost" &&
      opportunity.health === "critical",
  ).length;

  const kpis: ExecutiveKpi[] = [];

  const revenueAttainmentStatus = resolveStatus(
    revenueAttainment,
    1,
    0.75,
  );

  kpis.push({
    id: "revenue-attainment",
    category: "revenue",
    label: "تحقيق هدف الإيرادات",
    description:
      "نسبة التوقع التنفيذي الحالي إلى هدف الإيرادات.",
    value: revenueAttainment,
    formattedValue: formatPercentage(revenueAttainment),
    unit: "percentage",
    target: 1,
    targetFormattedValue: "100%",
    attainment: revenueAttainment,
    trend: resolveTrend(revenueAttainmentStatus),
    status: revenueAttainmentStatus,
    priority: resolvePriority(revenueAttainmentStatus),
    source: "revenue-operations",
    generatedAt,
  });

  const forecastConfidenceStatus = resolveStatus(
    forecastConfidence,
    0.75,
    0.55,
  );

  kpis.push({
    id: "forecast-confidence",
    category: "revenue",
    label: "ثقة توقع الإيرادات",
    description:
      "مستوى الثقة في التوقع التنفيذي المحسوب من خط المبيعات.",
    value: forecastConfidence,
    formattedValue: formatPercentage(forecastConfidence),
    unit: "percentage",
    target: 0.75,
    targetFormattedValue: "75%",
    attainment: clampRatio(forecastConfidence / 0.75),
    trend: resolveTrend(forecastConfidenceStatus),
    status: forecastConfidenceStatus,
    priority: resolvePriority(forecastConfidenceStatus),
    source: "revenue-operations",
    generatedAt,
  });

  const coverageStatus = resolveStatus(
    weightedCoverage,
    1,
    0.65,
  );

  kpis.push({
    id: "weighted-pipeline-coverage",
    category: "revenue",
    label: "التغطية المرجّحة",
    description:
      "نسبة قيمة خط المبيعات المرجّحة إلى هدف الإيرادات.",
    value: weightedCoverage,
    formattedValue: `${weightedCoverage.toFixed(2)}x`,
    unit: "ratio",
    target: 1,
    targetFormattedValue: "1.00x",
    attainment: clampRatio(weightedCoverage),
    trend: resolveTrend(coverageStatus),
    status: coverageStatus,
    priority: resolvePriority(coverageStatus),
    source: "revenue-operations",
    generatedAt,
  });

  const winRateStatus = resolveStatus(
    winRate,
    0.5,
    0.3,
  );

  kpis.push({
    id: "sales-win-rate",
    category: "sales",
    label: "معدل الفوز",
    description:
      "نسبة الفرص الناجحة إلى إجمالي الفرص المغلقة.",
    value: winRate,
    formattedValue: formatPercentage(winRate),
    unit: "percentage",
    target: 0.5,
    targetFormattedValue: "50%",
    attainment: clampRatio(winRate / 0.5),
    trend: resolveTrend(winRateStatus),
    status: winRateStatus,
    priority: resolvePriority(winRateStatus),
    source: "sales-intelligence",
    generatedAt,
  });

  const opportunityHealthStatus = resolveStatus(
    opportunityHealthRatio,
    0.75,
    0.5,
  );

  kpis.push({
    id: "opportunity-health",
    category: "sales",
    label: "صحة الفرص النشطة",
    description:
      "نسبة الفرص النشطة المصنفة بحالة صحية مستقرة.",
    value: opportunityHealthRatio,
    formattedValue: formatPercentage(opportunityHealthRatio),
    unit: "percentage",
    target: 0.75,
    targetFormattedValue: "75%",
    attainment: clampRatio(opportunityHealthRatio / 0.75),
    trend: resolveTrend(opportunityHealthStatus),
    status: opportunityHealthStatus,
    priority: resolvePriority(opportunityHealthStatus),
    source: "sales-intelligence",
    generatedAt,
  });

  const executionStatus = resolveStatus(
    executionReadiness,
    0.9,
    0.7,
  );

  kpis.push({
    id: "execution-readiness",
    category: "execution",
    label: "جاهزية التنفيذ",
    description:
      "نسبة الفرص النشطة التي تمتلك خطوة تالية وموعد تنفيذ واضحًا.",
    value: executionReadiness,
    formattedValue: formatPercentage(executionReadiness),
    unit: "percentage",
    target: 0.9,
    targetFormattedValue: "90%",
    attainment: clampRatio(executionReadiness / 0.9),
    trend: resolveTrend(executionStatus),
    status: executionStatus,
    priority: resolvePriority(executionStatus),
    source: "sales-intelligence",
    generatedAt,
  });

  const riskStatus = resolveStatus(
    openRevenueRisks,
    0,
    3,
    false,
  );

  kpis.push({
    id: "open-revenue-risks",
    category: "revenue",
    label: "مخاطر الإيرادات المفتوحة",
    description:
      "عدد إشارات مخاطر الإيرادات التي ما زالت مفتوحة.",
    value: openRevenueRisks,
    formattedValue: String(openRevenueRisks),
    unit: "count",
    target: 0,
    targetFormattedValue: "0",
    trend: resolveTrend(riskStatus),
    status: riskStatus,
    priority: resolvePriority(riskStatus),
    source: "revenue-operations",
    generatedAt,
  });

  const criticalOpportunityStatus = resolveStatus(
    criticalOpportunities,
    0,
    2,
    false,
  );

  kpis.push({
    id: "critical-opportunities",
    category: "sales",
    label: "الفرص الحرجة",
    description:
      "عدد الفرص النشطة التي تحتاج تدخلًا تنفيذيًا فوريًا.",
    value: criticalOpportunities,
    formattedValue: String(criticalOpportunities),
    unit: "count",
    target: 0,
    targetFormattedValue: "0",
    trend: resolveTrend(criticalOpportunityStatus),
    status: criticalOpportunityStatus,
    priority: resolvePriority(criticalOpportunityStatus),
    source: "sales-intelligence",
    generatedAt,
  });

  const velocityStatus = resolveStatus(
    revenue.velocity.revenueVelocity,
    1,
    0.01,
  );

  kpis.push({
    id: "revenue-velocity",
    category: "revenue",
    label: "سرعة الإيرادات",
    description:
      "القيمة اليومية المقدرة الناتجة عن حركة الفرص عبر خط المبيعات.",
    value: revenue.velocity.revenueVelocity,
    formattedValue: `${formatCurrency(
      revenue.velocity.revenueVelocity,
      currency,
    )} / يوم`,
    unit: "currency_per_day",
    trend: resolveTrend(velocityStatus),
    status: velocityStatus,
    priority: resolvePriority(velocityStatus),
    source: "revenue-operations",
    generatedAt,
  });

  return {
    kpis,
    revenueAttainment,
    forecastConfidence,
    weightedCoverage,
    winRate,
    opportunityHealthRatio,
    executionReadiness,
  };
}