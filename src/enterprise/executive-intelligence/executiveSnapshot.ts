import type {
  SalesIntelligenceSnapshot,
} from "../sales-intelligence/salesIntelligenceTypes";

import {
  aggregateExecutiveKpis,
} from "./executiveKpiAggregator";

import {
  calculateOrganizationHealth,
} from "./executiveHealth";

import type {
  ExecutiveKpi,
  ExecutiveKpiSnapshot,
  ExecutiveSummary,
} from "./executiveKpiTypes";

function buildExecutiveSummary(
  healthScore: number,
  kpis: ExecutiveKpi[],
): ExecutiveSummary {
  const healthyKpis = kpis.filter(
    (kpi) => kpi.status === "healthy",
  );

  const concernKpis = kpis
    .filter((kpi) => kpi.status !== "healthy")
    .sort((first, second) => {
      const priorityRank = {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
      };

      return (
        priorityRank[second.priority] -
        priorityRank[first.priority]
      );
    });

  const headline =
    healthScore >= 75
      ? "الأداء المؤسسي مستقر مع فرص واضحة لتعزيز النمو."
      : healthScore >= 50
        ? "الأداء المؤسسي يحتاج تركيزًا تنفيذيًا على بعض المؤشرات."
        : "الأداء المؤسسي يحتاج تدخلًا تنفيذيًا مباشرًا.";

  const overview =
    concernKpis.length > 0
      ? `تم رصد ${concernKpis.length} مؤشرات تحتاج متابعة تنفيذية، منها ${
          concernKpis.filter(
            (kpi) => kpi.status === "critical",
          ).length
        } مؤشرات حرجة.`
      : "جميع المؤشرات التنفيذية الأساسية ضمن النطاق المستقر حاليًا.";

  return {
    headline,
    overview,
    strengths: healthyKpis
      .slice(0, 3)
      .map(
        (kpi) =>
          `${kpi.label}: ${kpi.formattedValue}`,
      ),
    concerns: concernKpis
      .slice(0, 3)
      .map(
        (kpi) =>
          `${kpi.label}: ${kpi.formattedValue}`,
      ),
    recommendedFocus: concernKpis
      .slice(0, 3)
      .map((kpi) => {
        if (kpi.category === "revenue") {
          return `مراجعة ${kpi.label} واتخاذ إجراء لتحسين توقع الإيرادات.`;
        }

        if (kpi.category === "sales") {
          return `توجيه فريق المبيعات لمعالجة ${kpi.label}.`;
        }

        return `رفع مستوى ${kpi.label} ومراجعة مسؤوليات التنفيذ.`;
      }),
  };
}

export function createExecutiveKpiSnapshot(
  salesSnapshot: SalesIntelligenceSnapshot,
): ExecutiveKpiSnapshot {
  const aggregation =
    aggregateExecutiveKpis(salesSnapshot);

  const health = calculateOrganizationHealth({
    revenueAttainment: aggregation.revenueAttainment,
    forecastConfidence: aggregation.forecastConfidence,
    weightedCoverage: aggregation.weightedCoverage,
    winRate: aggregation.winRate,
    opportunityHealthRatio:
      aggregation.opportunityHealthRatio,
    executionReadiness: aggregation.executionReadiness,
    generatedAt: salesSnapshot.generatedAt,
  });

  return {
    generatedAt: salesSnapshot.generatedAt,
    currency: salesSnapshot.currency,
    health,
    kpis: aggregation.kpis,
    summary: buildExecutiveSummary(
      health.score,
      aggregation.kpis,
    ),
  };
}