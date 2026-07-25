import type {
  ExecutiveKpi,
  ExecutiveKpiSnapshot,
} from "./executiveKpiTypes";

import {
  calculateExecutiveAlertScore,
} from "./executiveAlertPrioritization";

import type {
  ExecutiveAlert,
  ExecutiveAlertAction,
  ExecutiveAlertSnapshot,
  ExecutiveAlertSummary,
  ExecutiveAlertType,
} from "./executiveAlertTypes";

function resolveAlertType(
  kpi: ExecutiveKpi,
): ExecutiveAlertType {
  if (kpi.category === "revenue") {
    return "revenue";
  }

  if (kpi.category === "sales") {
    return "sales";
  }

  if (kpi.category === "execution") {
    return "operational";
  }

  return "strategic";
}

function resolveAction(
  kpi: ExecutiveKpi,
): ExecutiveAlertAction {
  if (kpi.category === "revenue") {
    return {
      type:
        kpi.status === "critical"
          ? "escalate"
          : "review",
      label:
        kpi.status === "critical"
          ? "تصعيد مراجعة الإيرادات"
          : "مراجعة توقع الإيرادات",
      description:
        "مراجعة الفرص المؤثرة على التوقع وتحديد إجراءات تحسين التغطية والثقة.",
    };
  }

  if (kpi.category === "sales") {
    return {
      type: "assign",
      label: "تعيين إجراء لفريق المبيعات",
      description:
        "تحديد مالك واضح للمعالجة ومراجعة الفرص المتأثرة والخطوات التالية.",
    };
  }

  if (kpi.category === "execution") {
    return {
      type: "investigate",
      label: "مراجعة جاهزية التنفيذ",
      description:
        "فحص الفرص التي لا تملك خطوة تالية أو موعد تنفيذ واضحًا.",
    };
  }

  return {
    type: "review",
    label: "مراجعة المؤشر التنفيذي",
    description:
      "مراجعة المؤشر وتحديد القرار التنفيذي المناسب.",
  };
}

function resolveImpact(
  kpi: ExecutiveKpi,
): string {
  if (kpi.status === "critical") {
    return "تأثير مباشر مرتفع على الأداء التنفيذي والنتائج المتوقعة.";
  }

  if (kpi.status === "attention") {
    return "قد يتطور إلى أثر تنفيذي مرتفع إذا لم تتم معالجته.";
  }

  return "الأثر الحالي محدود مع ضرورة استمرار المراقبة.";
}

function createAlert(
  kpi: ExecutiveKpi,
): ExecutiveAlert {
  return {
    id: `executive-alert-${kpi.id}`,
    type: resolveAlertType(kpi),
    category: kpi.category,
    title:
      kpi.status === "critical"
        ? `تنبيه حرج: ${kpi.label}`
        : `تنبيه تنفيذي: ${kpi.label}`,
    description:
      `${kpi.description} القيمة الحالية: ${kpi.formattedValue}.`,
    priority: kpi.priority,
    healthStatus: kpi.status,
    status: "open",
    sourceKpiId: kpi.id,
    source: kpi.source,
    score: calculateExecutiveAlertScore(kpi),
    impact: resolveImpact(kpi),
    recommendedAction: resolveAction(kpi),
    generatedAt: kpi.generatedAt,
  };
}

function buildSummary(
  alerts: ExecutiveAlert[],
): ExecutiveAlertSummary {
  return {
    total: alerts.length,
    critical: alerts.filter(
      (alert) => alert.priority === "critical",
    ).length,
    high: alerts.filter(
      (alert) => alert.priority === "high",
    ).length,
    medium: alerts.filter(
      (alert) => alert.priority === "medium",
    ).length,
    low: alerts.filter(
      (alert) => alert.priority === "low",
    ).length,
    strategic: alerts.filter(
      (alert) => alert.type === "strategic",
    ).length,
    revenue: alerts.filter(
      (alert) => alert.type === "revenue",
    ).length,
    sales: alerts.filter(
      (alert) => alert.type === "sales",
    ).length,
    operational: alerts.filter(
      (alert) => alert.type === "operational",
    ).length,
  };
}

export function createExecutiveAlertSnapshot(
  kpiSnapshot: ExecutiveKpiSnapshot,
): ExecutiveAlertSnapshot {
  const alerts = kpiSnapshot.kpis
    .filter((kpi) => kpi.status !== "healthy")
    .map(createAlert)
    .sort(
      (first, second) =>
        second.score - first.score,
    );

  return {
    generatedAt: kpiSnapshot.generatedAt,
    alerts,
    summary: buildSummary(alerts),
  };
}