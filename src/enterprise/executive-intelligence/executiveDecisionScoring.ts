import type {
  ExecutiveAlert,
} from "./executiveAlertTypes";

import type {
  ExecutiveKpi,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

import type {
  ExecutiveDecisionConfidence,
  ExecutiveDecisionImpact,
  ExecutiveDecisionUrgency,
} from "./executiveDecisionTypes";

function clampScore(value: number): number {
  return Math.min(
    100,
    Math.max(0, Math.round(value)),
  );
}

function priorityWeight(
  priority: ExecutiveKpiPriority,
): number {
  switch (priority) {
    case "critical":
      return 100;
    case "high":
      return 80;
    case "medium":
      return 55;
    case "low":
      return 30;
  }
}

export function resolveDecisionUrgency(
  alert: ExecutiveAlert,
): ExecutiveDecisionUrgency {
  if (
    alert.priority === "critical" ||
    alert.score >= 85
  ) {
    return "immediate";
  }

  if (
    alert.priority === "high" ||
    alert.score >= 70
  ) {
    return "today";
  }

  if (
    alert.priority === "medium" ||
    alert.score >= 50
  ) {
    return "this_week";
  }

  return "monitor";
}

export function calculateDecisionScore(
  alert: ExecutiveAlert,
  kpi?: ExecutiveKpi,
): number {
  const attainmentRisk =
    kpi?.attainment === undefined
      ? 50
      : clampScore(
          (1 - Math.min(
            1,
            Math.max(0, kpi.attainment),
          )) * 100,
        );

  return clampScore(
    alert.score * 0.55 +
    priorityWeight(alert.priority) * 0.3 +
    attainmentRisk * 0.15,
  );
}

export function calculateDecisionImpact(
  alert: ExecutiveAlert,
): ExecutiveDecisionImpact {
  let revenue = 20;
  let sales = 20;
  let operations = 20;
  let strategic = 20;

  switch (alert.type) {
    case "revenue":
      revenue = 95;
      sales = 70;
      strategic = 70;
      operations = 45;
      break;

    case "sales":
      sales = 95;
      revenue = 75;
      strategic = 60;
      operations = 55;
      break;

    case "operational":
      operations = 95;
      sales = 65;
      revenue = 55;
      strategic = 55;
      break;

    case "strategic":
      strategic = 95;
      revenue = 70;
      sales = 65;
      operations = 60;
      break;
  }

  const priorityMultiplier =
    priorityWeight(alert.priority) / 100;

  const overall = clampScore(
    (
      revenue +
      sales +
      operations +
      strategic
    ) /
      4 *
      (0.7 + priorityMultiplier * 0.3),
  );

  return {
    revenue: clampScore(revenue * priorityMultiplier),
    sales: clampScore(sales * priorityMultiplier),
    operations: clampScore(
      operations * priorityMultiplier,
    ),
    strategic: clampScore(
      strategic * priorityMultiplier,
    ),
    overall,
    description:
      overall >= 80
        ? "القرار ذو أثر تنفيذي مرتفع ومباشر على النتائج."
        : overall >= 60
          ? "القرار ذو أثر مهم ويتطلب معالجة منظمة."
          : "الأثر محدود حاليًا ويحتاج إلى المتابعة.",
  };
}

export function calculateDecisionConfidence(
  alert: ExecutiveAlert,
  kpi?: ExecutiveKpi,
): ExecutiveDecisionConfidence {
  let evidenceScore = 55;

  if (kpi) {
    evidenceScore += 20;
  }

  if (kpi?.attainment !== undefined) {
    evidenceScore += 15;
  }

  if (alert.score >= 80) {
    evidenceScore += 10;
  }

  const score = clampScore(evidenceScore);

  return {
    score,
    level:
      score >= 80
        ? "high"
        : score >= 60
          ? "medium"
          : "low",
    explanation:
      score >= 80
        ? "التوصية مدعومة بمؤشرات وتنبيهات تنفيذية واضحة."
        : score >= 60
          ? "التوصية مدعومة بأدلة كافية مع الحاجة إلى مراجعة تنفيذية."
          : "التوصية تحتاج إلى بيانات إضافية قبل اعتماد قرار نهائي.",
  };
}