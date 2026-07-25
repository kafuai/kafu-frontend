import type {
  ExecutiveAlert,
  ExecutiveAlertSnapshot,
} from "./executiveAlertTypes";

import type {
  ExecutiveKpi,
  ExecutiveKpiSnapshot,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

import type {
  ExecutiveBriefing,
  ExecutiveBriefingHighlight,
  ExecutiveBriefingMetric,
  ExecutiveBriefingRisk,
  ExecutiveBriefingSection,
} from "./executiveBriefingTypes";

function priorityRank(
  priority: ExecutiveKpiPriority,
): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

function createMetrics(
  kpis: ExecutiveKpi[],
): ExecutiveBriefingMetric[] {
  return [...kpis]
    .sort(
      (first, second) =>
        priorityRank(second.priority) -
        priorityRank(first.priority),
    )
    .slice(0, 6)
    .map((kpi) => ({
      id: kpi.id,
      label: kpi.label,
      value: kpi.formattedValue,
      status: kpi.status,
      priority: kpi.priority,
    }));
}

function createHighlights(
  snapshot: ExecutiveKpiSnapshot,
): ExecutiveBriefingHighlight[] {
  const healthyKpis = snapshot.kpis
    .filter((kpi) => kpi.status === "healthy")
    .slice(0, 4);

  if (healthyKpis.length > 0) {
    return healthyKpis.map((kpi) => ({
      id: `highlight-${kpi.id}`,
      title: kpi.label,
      description:
        `${kpi.description} القيمة الحالية: ${kpi.formattedValue}.`,
      status: kpi.status,
    }));
  }

  return snapshot.health.dimensions
    .filter(
      (dimension) =>
        dimension.status !== "critical",
    )
    .slice(0, 3)
    .map((dimension) => ({
      id: `highlight-${dimension.id}`,
      title: dimension.label,
      description:
        `${dimension.explanation} النتيجة الحالية: ${dimension.score}/100.`,
      status: dimension.status,
    }));
}

function createRisks(
  alerts: ExecutiveAlert[],
): ExecutiveBriefingRisk[] {
  return alerts
    .filter(
      (alert) =>
        alert.priority === "critical" ||
        alert.priority === "high",
    )
    .slice(0, 5)
    .map((alert) => ({
      id: `risk-${alert.id}`,
      title: alert.title,
      description: alert.impact,
      priority: alert.priority,
      recommendedAction:
        alert.recommendedAction.description,
    }));
}

function createPerformanceSection(
  snapshot: ExecutiveKpiSnapshot,
): ExecutiveBriefingSection {
  const topKpis = [...snapshot.kpis]
    .sort(
      (first, second) =>
        priorityRank(second.priority) -
        priorityRank(first.priority),
    )
    .slice(0, 5);

  return {
    id: "executive-performance",
    type: "performance",
    title: "الأداء التنفيذي",
    summary:
      `بلغت صحة المؤسسة ${snapshot.health.score}/100، مع ${
        snapshot.health.criticalDimensions
      } أبعاد حرجة و${
        snapshot.health.attentionDimensions
      } أبعاد تحتاج متابعة.`,
    items: topKpis.map(
      (kpi) =>
        `${kpi.label}: ${kpi.formattedValue}`,
    ),
    priority:
      snapshot.health.status === "critical"
        ? "critical"
        : snapshot.health.status === "attention"
          ? "high"
          : "medium",
  };
}

function createRiskSection(
  alerts: ExecutiveAlertSnapshot,
): ExecutiveBriefingSection {
  return {
    id: "executive-risks",
    type: "risk",
    title: "المخاطر والتنبيهات",
    summary:
      alerts.summary.total > 0
        ? `تم رصد ${alerts.summary.total} تنبيهات تنفيذية، منها ${alerts.summary.critical} حرجة و${alerts.summary.high} مرتفعة الأولوية.`
        : "لا توجد تنبيهات تنفيذية مفتوحة حاليًا.",
    items: alerts.alerts
      .slice(0, 5)
      .map(
        (alert) =>
          `${alert.title} — ${alert.recommendedAction.label}`,
      ),
    priority:
      alerts.summary.critical > 0
        ? "critical"
        : alerts.summary.high > 0
          ? "high"
          : "medium",
  };
}

function createOpportunitySection(
  snapshot: ExecutiveKpiSnapshot,
): ExecutiveBriefingSection {
  const healthyKpis = snapshot.kpis
    .filter((kpi) => kpi.status === "healthy")
    .slice(0, 4);

  return {
    id: "executive-opportunities",
    type: "opportunity",
    title: "فرص تعزيز الأداء",
    summary:
      healthyKpis.length > 0
        ? "توجد مؤشرات مستقرة يمكن البناء عليها لدعم النمو وتحسين النتائج."
        : "الأولوية الحالية هي استعادة استقرار المؤشرات الأساسية قبل توسيع مبادرات النمو.",
    items:
      healthyKpis.length > 0
        ? healthyKpis.map(
            (kpi) =>
              `الاستفادة من استقرار ${kpi.label} عند ${kpi.formattedValue}.`,
          )
        : [
            "تركيز الموارد على المؤشرات الحرجة.",
            "رفع جودة خطط التنفيذ والمتابعة.",
            "تحسين ثقة التوقع وتغطية خط المبيعات.",
          ],
    priority: "medium",
  };
}

function createExecutionSection(
  snapshot: ExecutiveKpiSnapshot,
  alerts: ExecutiveAlertSnapshot,
): ExecutiveBriefingSection {
  const executionKpis = snapshot.kpis.filter(
    (kpi) => kpi.category === "execution",
  );

  const operationalAlerts = alerts.alerts.filter(
    (alert) => alert.type === "operational",
  );

  return {
    id: "executive-execution",
    type: "execution",
    title: "جاهزية التنفيذ",
    summary:
      operationalAlerts.length > 0
        ? `توجد ${operationalAlerts.length} تنبيهات تشغيلية تحتاج متابعة المسؤوليات والخطوات التالية.`
        : "لا توجد عوائق تشغيلية حرجة مرصودة ضمن المؤشرات الحالية.",
    items: [
      ...executionKpis.map(
        (kpi) =>
          `${kpi.label}: ${kpi.formattedValue}`,
      ),
      ...operationalAlerts
        .slice(0, 3)
        .map(
          (alert) =>
            alert.recommendedAction.description,
        ),
    ],
    priority:
      operationalAlerts.some(
        (alert) => alert.priority === "critical",
      )
        ? "critical"
        : operationalAlerts.length > 0
          ? "high"
          : "medium",
  };
}

function createFocusSection(
  snapshot: ExecutiveKpiSnapshot,
  alerts: ExecutiveAlertSnapshot,
): ExecutiveBriefingSection {
  const alertActions = alerts.alerts
    .slice(0, 4)
    .map(
      (alert) =>
        alert.recommendedAction.description,
    );

  const summaryFocus =
    snapshot.summary.recommendedFocus.slice(0, 4);

  const items = Array.from(
    new Set([
      ...alertActions,
      ...summaryFocus,
    ]),
  ).slice(0, 5);

  return {
    id: "executive-focus",
    type: "focus",
    title: "التركيز التنفيذي",
    summary:
      items.length > 0
        ? "هذه الإجراءات تمثل أعلى أولويات القيادة في الدورة الحالية."
        : "الاستمرار في مراقبة المؤشرات والمحافظة على الاستقرار التشغيلي.",
    items:
      items.length > 0
        ? items
        : [
            "مراقبة المؤشرات التنفيذية بصورة دورية.",
            "المحافظة على وضوح المسؤوليات والخطوات التالية.",
          ],
    priority:
      alerts.summary.critical > 0
        ? "critical"
        : alerts.summary.high > 0
          ? "high"
          : "medium",
  };
}

function createImmediatePriorities(
  snapshot: ExecutiveKpiSnapshot,
  alerts: ExecutiveAlertSnapshot,
): string[] {
  const alertPriorities = alerts.alerts
    .slice(0, 5)
    .map(
      (alert) =>
        alert.recommendedAction.label,
    );

  return Array.from(
    new Set([
      ...alertPriorities,
      ...snapshot.summary.recommendedFocus,
    ]),
  ).slice(0, 5);
}

export function composeExecutiveBriefing(
  kpiSnapshot: ExecutiveKpiSnapshot,
  alertSnapshot: ExecutiveAlertSnapshot,
): ExecutiveBriefing {
  const sections: ExecutiveBriefingSection[] = [
    {
      id: "executive-overview",
      type: "overview",
      title: "نظرة القيادة",
      summary: kpiSnapshot.summary.overview,
      items: [
        ...kpiSnapshot.summary.strengths,
        ...kpiSnapshot.summary.concerns,
      ].slice(0, 6),
      priority:
        kpiSnapshot.health.status === "critical"
          ? "critical"
          : kpiSnapshot.health.status === "attention"
            ? "high"
            : "medium",
    },
    createPerformanceSection(kpiSnapshot),
    createRiskSection(alertSnapshot),
    createOpportunitySection(kpiSnapshot),
    createExecutionSection(
      kpiSnapshot,
      alertSnapshot,
    ),
    createFocusSection(
      kpiSnapshot,
      alertSnapshot,
    ),
  ];

  return {
    id: `executive-briefing-${kpiSnapshot.generatedAt}`,
    generatedAt: kpiSnapshot.generatedAt,
    period: "current",
    title: "الإحاطة التنفيذية",
    headline: kpiSnapshot.summary.headline,
    executiveSummary:
      `${kpiSnapshot.summary.overview} مستوى صحة المؤسسة الحالي هو ${kpiSnapshot.health.score}/100.`,
    organizationHealth: {
      score: kpiSnapshot.health.score,
      status: kpiSnapshot.health.status,
    },
    metrics: createMetrics(kpiSnapshot.kpis),
    highlights: createHighlights(kpiSnapshot),
    risks: createRisks(alertSnapshot.alerts),
    sections,
    immediatePriorities:
      createImmediatePriorities(
        kpiSnapshot,
        alertSnapshot,
      ),
  };
}