import type {
  ExecutiveAlert,
  ExecutiveAlertSnapshot,
} from "./executiveAlertTypes";

import type {
  ExecutiveBriefing,
} from "./executiveBriefingTypes";

import {
  calculateDecisionConfidence,
  calculateDecisionImpact,
  calculateDecisionScore,
  resolveDecisionUrgency,
} from "./executiveDecisionScoring";

import type {
  ExecutiveDecisionAction,
  ExecutiveDecisionRecommendation,
  ExecutiveDecisionSnapshot,
  ExecutiveDecisionSummary,
  ExecutiveDecisionType,
} from "./executiveDecisionTypes";

import type {
  ExecutiveKpi,
  ExecutiveKpiSnapshot,
} from "./executiveKpiTypes";

function resolveDecisionType(
  alert: ExecutiveAlert,
): ExecutiveDecisionType {
  if (
    alert.priority === "critical" &&
    alert.healthStatus === "critical"
  ) {
    return "risk";
  }

  return alert.type;
}

function createActions(
  alert: ExecutiveAlert,
): ExecutiveDecisionAction[] {
  const commonActions: ExecutiveDecisionAction[] = [
    {
      id: `${alert.id}-review`,
      title: "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·آ§ط¸â€‍ط·آ£ط·آ¯ط¸â€‍ط·آ© ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹ط·آ©",
      description:
        `ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ´ط·آ± ${alert.sourceKpiId} ط¸ث†ط·آ§ط¸â€‍ط·ع¾ط·آ­ط¸â€ڑط¸â€ڑ ط¸â€¦ط¸â€  ط¸â€¦ط·آ³ط·آ¨ط·آ¨ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·آ§ط¸â€ ط·آ­ط·آ±ط·آ§ط¸ظ¾.`,
      sequence: 1,
      required: true,
    },
    {
      id: `${alert.id}-owner`,
      title: "ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط¸â€¦ط·آ§ط¸â€‍ط¸ئ’ ط·آ§ط¸â€‍ط¸â€ڑط·آ±ط·آ§ط·آ±",
      description:
        "ط·ع¾ط·آ¹ط¸ظ¹ط¸ظ¹ط¸â€  ط¸â€¦ط·آ³ط·آ¤ط¸ث†ط¸â€‍ ط¸ث†ط·آ§ط·آ¶ط·آ­ ط¸â€‍ط¸â€‍ط¸â€¦ط·آ¹ط·آ§ط¸â€‍ط·آ¬ط·آ© ط¸ث†ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط¸â€¦ط¸ث†ط·آ¹ط·آ¯ ط¸â€‍ط¸â€‍ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ©.",
      sequence: 2,
      required: true,
    },
  ];

  if (alert.type === "revenue") {
    return [
      ...commonActions,
      {
        id: `${alert.id}-revenue`,
        title: "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·آ®ط·آ· ط·آ§ط¸â€‍ط·آ¥ط¸ظ¹ط·آ±ط·آ§ط·آ¯ط·آ§ط·ع¾",
        description:
          "ط·ع¾ط·آ­ط¸â€‍ط¸ظ¹ط¸â€‍ ط·آ§ط¸â€‍ط¸ظ¾ط·آ±ط·آµ ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ«ط·آ±ط·آ© ط¸ظ¾ط¸ظ¹ ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط¸â€ڑط·آ¹ ط¸ث†ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ« ط¸â€¦ط·آ³ط·ع¾ط¸ث†ط¸â€° ط·آ§ط¸â€‍ط·آ«ط¸â€ڑط·آ© ط¸ث†ط·آ®ط·آ·ط·آ© ط·آ§ط¸â€‍ط·آ¥ط·ط›ط¸â€‍ط·آ§ط¸â€ڑ.",
        sequence: 3,
        required: true,
      },
      {
        id: `${alert.id}-forecast`,
        title: "ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ« ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط¸â€ڑط·آ¹ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹",
        description:
          "ط·آ§ط·آ¹ط·ع¾ط¸â€¦ط·آ§ط·آ¯ ط·ع¾ط¸ث†ط¸â€ڑط·آ¹ ط¸â€¦ط·آ­ط·آ¯ط·آ« ط¸ظ¹ط·آ¹ط¸ئ’ط·آ³ ط·آ§ط¸â€‍ط¸â€¦ط·آ®ط·آ§ط·آ·ط·آ± ط¸ث†ط·آ§ط¸â€‍ط¸ظ¾ط·آ±ط·آµ ط·آ§ط¸â€‍ط¸ظ¾ط·آ¹ط¸â€‍ط¸ظ¹ط·آ©.",
        sequence: 4,
        required: false,
      },
    ];
  }

  if (alert.type === "sales") {
    return [
      ...commonActions,
      {
        id: `${alert.id}-sales`,
        title: "ط·ع¾ط¸â€ ط·آ´ط¸ظ¹ط·آ· ط·آ®ط·آ·ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ¨ط¸ظ¹ط·آ¹ط·آ§ط·ع¾",
        description:
          "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·آ§ط¸â€‍ط¸ظ¾ط·آ±ط·آµ ط¸ث†ط·آ§ط¸â€‍ط·آ¹ط¸â€¦ط¸â€‍ط·آ§ط·طŒ ط·آ§ط¸â€‍ط¸â€¦ط·ع¾ط·آ£ط·آ«ط·آ±ط¸ظ¹ط¸â€  ط¸ث†ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط·آ®ط·آ·ط¸ث†ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·ع¾ط·آ¬ط·آ§ط·آ±ط¸ظ¹ط·آ© ط·آ§ط¸â€‍ط·ع¾ط·آ§ط¸â€‍ط¸ظ¹ط·آ©.",
        sequence: 3,
        required: true,
      },
      {
        id: `${alert.id}-follow-up`,
        title: "ط·آ¶ط·آ¨ط·آ· ط·آ§ط¸â€‍ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ©",
        description:
          "ط·آ§ط¸â€‍ط·ع¾ط·آ£ط¸ئ’ط·آ¯ ط¸â€¦ط¸â€  ط¸ث†ط·آ¬ط¸ث†ط·آ¯ ط¸â€¦ط·آ³ط·آ¤ط¸ث†ط¸â€‍ ط¸ث†ط¸â€¦ط¸ث†ط·آ¹ط·آ¯ ط¸ث†ط·آ®ط·آ·ط¸ث†ط·آ© ط·ع¾ط·آ§ط¸â€‍ط¸ظ¹ط·آ© ط¸â€‍ط¸ئ’ط¸â€‍ ط¸ظ¾ط·آ±ط·آµط·آ© ط·آ°ط·آ§ط·ع¾ ط·آ£ط¸ث†ط¸â€‍ط¸ث†ط¸ظ¹ط·آ©.",
        sequence: 4,
        required: false,
      },
    ];
  }

  if (alert.type === "operational") {
    return [
      ...commonActions,
      {
        id: `${alert.id}-execution`,
        title: "ط¸â€¦ط·آ¹ط·آ§ط¸â€‍ط·آ¬ط·آ© ط¸ظ¾ط·آ¬ط¸ث†ط·آ© ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°",
        description:
          "ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط·آ¹ط·آ§ط·آ¦ط¸â€ڑ ط·آ§ط¸â€‍ط·ع¾ط·آ´ط·ط›ط¸ظ¹ط¸â€‍ط¸ظ¹ ط¸ث†ط¸â€¦ط·آ¹ط·آ§ط¸â€‍ط·آ¬ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ³ط·آ¤ط¸ث†ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط·آ§ط·آ¹ط¸ظ¹ط·آ¯ ط¸ث†ط·آ§ط¸â€‍ط·آ®ط·آ·ط¸ث†ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·ع¾ط·آ§ط¸â€‍ط¸ظ¹ط·آ©.",
        sequence: 3,
        required: true,
      },
    ];
  }

  return [
    ...commonActions,
    {
      id: `${alert.id}-strategic`,
      title: "ط·آ§ط·آ¹ط·ع¾ط¸â€¦ط·آ§ط·آ¯ ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط·آ¬ط¸â€، ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹",
      description:
        "ط·ع¾ط¸â€ڑط¸ظ¹ط¸ظ¹ط¸â€¦ ط·آ§ط¸â€‍ط·آ¨ط·آ¯ط·آ§ط·آ¦ط¸â€‍ ط¸ث†ط·آ§ط·آ¹ط·ع¾ط¸â€¦ط·آ§ط·آ¯ ط·آ§ط¸â€‍ط·آ¥ط·آ¬ط·آ±ط·آ§ط·طŒ ط·آ§ط¸â€‍ط·آ£ط¸ئ’ط·آ«ط·آ± ط·آ§ط·ع¾ط·آ³ط·آ§ط¸â€ڑط¸â€¹ط·آ§ ط¸â€¦ط·آ¹ ط·آ§ط¸â€‍ط·آ£ط¸ث†ط¸â€‍ط¸ث†ط¸ظ¹ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·آ§ط·آ³ط·ع¾ط·آ±ط·آ§ط·ع¾ط¸ظ¹ط·آ¬ط¸ظ¹ط·آ©.",
      sequence: 3,
      required: true,
    },
  ];
}

function resolveExpectedOutcome(
  alert: ExecutiveAlert,
): string {
  switch (alert.type) {
    case "revenue":
      return "ط·آ±ط¸ظ¾ط·آ¹ ط¸â€¦ط¸ث†ط·آ«ط¸ث†ط¸â€ڑط¸ظ¹ط·آ© ط·ع¾ط¸ث†ط¸â€ڑط·آ¹ ط·آ§ط¸â€‍ط·آ¥ط¸ظ¹ط·آ±ط·آ§ط·آ¯ط·آ§ط·ع¾ ط¸ث†ط·ع¾ط·آ­ط·آ³ط¸ظ¹ط¸â€  ط·ع¾ط·ط›ط·آ·ط¸ظ¹ط·آ© ط·آ§ط¸â€‍ط¸ظ¾ط·آ±ط·آµ ط·آ°ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط¸â€ڑط¸ظ¹ط¸â€¦ط·آ©.";

    case "sales":
      return "ط·ع¾ط·آ­ط·آ³ط¸ظ¹ط¸â€  ط·آ­ط·آ±ط¸ئ’ط·آ© ط·آ§ط¸â€‍ط¸ظ¾ط·آ±ط·آµ ط¸ث†ط·آ¬ط¸ث†ط·آ¯ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ© ط¸ث†ط·آ²ط¸ظ¹ط·آ§ط·آ¯ط·آ© ط¸ث†ط·آ¶ط¸ث†ط·آ­ ط·آ§ط¸â€‍ط·آ®ط·آ·ط¸ث†ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·ع¾ط·آ§ط¸â€‍ط¸ظ¹ط·آ©.";

    case "operational":
      return "ط·ع¾ط¸â€ڑط¸â€‍ط¸ظ¹ط¸â€‍ ط·آ¹ط¸ث†ط·آ§ط·آ¦ط¸â€ڑ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ° ط¸ث†ط·آ±ط¸ظ¾ط·آ¹ ط¸ث†ط·آ¶ط¸ث†ط·آ­ ط·آ§ط¸â€‍ط¸â€¦ط·آ³ط·آ¤ط¸ث†ط¸â€‍ط¸ظ¹ط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط·آ§ط·آ¹ط¸ظ¹ط·آ¯.";

    case "strategic":
      return "ط·ع¾ط·آ­ط·آ³ط¸ظ¹ط¸â€  ط·آ§ط·ع¾ط·آ³ط·آ§ط¸â€ڑ ط·آ§ط¸â€‍ط¸â€ڑط·آ±ط·آ§ط·آ±ط·آ§ط·ع¾ ط¸â€¦ط·آ¹ ط·آ§ط¸â€‍ط·آ£ط¸ث†ط¸â€‍ط¸ث†ط¸ظ¹ط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ´ط·آ±ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹ط·آ©.";
  }
}

function findSourceKpi(
  alert: ExecutiveAlert,
  snapshot: ExecutiveKpiSnapshot,
): ExecutiveKpi | undefined {
  return snapshot.kpis.find(
    (kpi) => kpi.id === alert.sourceKpiId,
  );
}

function createRecommendation(
  alert: ExecutiveAlert,
  kpiSnapshot: ExecutiveKpiSnapshot,
  briefing: ExecutiveBriefing,
): ExecutiveDecisionRecommendation {
  const sourceKpi = findSourceKpi(
    alert,
    kpiSnapshot,
  );

  const score = calculateDecisionScore(
    alert,
    sourceKpi,
  );

  return {
    id: `decision-${alert.id}`,
    type: resolveDecisionType(alert),
    category: alert.category,
    title:
      alert.priority === "critical"
        ? `ط¸â€ڑط·آ±ط·آ§ط·آ± ط·آ¹ط·آ§ط·آ¬ط¸â€‍: ${alert.recommendedAction.label}`
        : `ط¸â€ڑط·آ±ط·آ§ط·آ± ط¸â€¦ط¸â€ڑط·ع¾ط·آ±ط·آ­: ${alert.recommendedAction.label}`,
    rationale:
      `${alert.description} ${alert.impact}`,
    expectedOutcome:
      resolveExpectedOutcome(alert),
    priority: alert.priority,
    urgency: resolveDecisionUrgency(alert),
    healthStatus: alert.healthStatus,
    status: "proposed",
    score,
    impact: calculateDecisionImpact(alert),
    confidence: calculateDecisionConfidence(
      alert,
      sourceKpi,
    ),
    evidence: [
      {
        sourceType: "alert",
        sourceId: alert.id,
        statement: alert.description,
      },
      ...(sourceKpi
        ? [
            {
              sourceType: "kpi" as const,
              sourceId: sourceKpi.id,
              statement:
                `${sourceKpi.label}: ${sourceKpi.formattedValue}`,
            },
          ]
        : []),
      {
        sourceType: "briefing",
        sourceId: briefing.id,
        statement: briefing.executiveSummary,
      },
    ],
    actions: createActions(alert),
    sourceAlertId: alert.id,
    sourceKpiId: sourceKpi?.id,
    generatedAt: alert.generatedAt,
  };
}

function resolveHealthDimensionCategory(
  dimensionId: string,
): ExecutiveDecisionRecommendation["category"] {
  const normalizedId = dimensionId.toLowerCase();

  if (normalizedId.includes("revenue")) {
    return "revenue";
  }

  if (
    normalizedId.includes("sales") ||
    normalizedId.includes("pipeline")
  ) {
    return "sales";
  }

  if (
    normalizedId.includes("execution") ||
    normalizedId.includes("operation")
  ) {
    return "execution";
  }

  return "execution";
}

function createHealthRecommendation(
  kpiSnapshot: ExecutiveKpiSnapshot,
  briefing: ExecutiveBriefing,
): ExecutiveDecisionRecommendation | undefined {
  if (
    kpiSnapshot.health.status === "healthy"
  ) {
    return undefined;
  }

  const criticalDimension =
    kpiSnapshot.health.dimensions
      .filter(
        (dimension) =>
          dimension.status !== "healthy",
      )
      .sort(
        (first, second) =>
          first.score - second.score,
      )[0];

  if (!criticalDimension) {
    return undefined;
  }

  const priority =
    criticalDimension.status === "critical"
      ? "critical"
      : "high";

  return {
    id: `decision-health-${criticalDimension.id}`,
    type: "strategic",
    category: resolveHealthDimensionCategory(criticalDimension.id),
    title:
      `ط·آ±ط¸ظ¾ط·آ¹ ط·آµط·آ­ط·آ© ${criticalDimension.label}`,
    rationale:
      criticalDimension.explanation,
    expectedOutcome:
      "ط·آ±ط¸ظ¾ط·آ¹ ط·آµط·آ­ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ³ط·آ³ط·آ© ط¸ث†ط·ع¾ط¸â€ڑط¸â€‍ط¸ظ¹ط¸â€‍ ط¸â€¦ط·آ®ط·آ§ط·آ·ط·آ± ط·آ§ط¸â€‍ط·آ§ط¸â€ ط·آ­ط·آ±ط·آ§ط¸ظ¾ ط·آ¹ط¸â€  ط·آ§ط¸â€‍ط·آ£ط¸â€،ط·آ¯ط·آ§ط¸ظ¾ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹ط·آ©.",
    priority,
    urgency:
      priority === "critical"
        ? "immediate"
        : "today",
    healthStatus: criticalDimension.status,
    status: "proposed",
    score:
      priority === "critical"
        ? 90
        : 75,
    impact: {
      revenue: 65,
      sales: 65,
      operations: 70,
      strategic: 90,
      overall: 73,
      description:
        "ط·آ§ط¸â€‍ط¸â€ڑط·آ±ط·آ§ط·آ± ط¸ظ¹ط·آ¤ط·آ«ط·آ± ط¸ظ¾ط¸ظ¹ ط·آµط·آ­ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ³ط·آ³ط·آ© ط¸ث†ط¸ظ¹ط·آ¹ط·آ²ط·آ² ط·آ§ط·آ³ط·ع¾ط¸â€ڑط·آ±ط·آ§ط·آ± ط·آ§ط¸â€‍ط·آ£ط·آ¯ط·آ§ط·طŒ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹.",
    },
    confidence: {
      score: 80,
      level: "high",
      explanation:
        "ط·آ§ط¸â€‍ط·ع¾ط¸ث†ط·آµط¸ظ¹ط·آ© ط¸â€¦ط·آ¯ط·آ¹ط¸ث†ط¸â€¦ط·آ© ط·آ¨ط¸â€ ط·ع¾ط¸ظ¹ط·آ¬ط·آ© ط·آµط·آ­ط·آ© ط·آ§ط¸â€‍ط¸â€¦ط·آ¤ط·آ³ط·آ³ط·آ© ط¸ث†ط·آ£ط·آ¨ط·آ¹ط·آ§ط·آ¯ ط·آ§ط¸â€‍ط·آ£ط·آ¯ط·آ§ط·طŒ ط·آ§ط¸â€‍ط·آ­ط·آ§ط¸â€‍ط¸ظ¹ط·آ©.",
    },
    evidence: [
      {
        sourceType: "kpi",
        sourceId: criticalDimension.id,
        statement:
          `${criticalDimension.label}: ${criticalDimension.score}/100`,
      },
      {
        sourceType: "briefing",
        sourceId: briefing.id,
        statement: briefing.executiveSummary,
      },
    ],
    actions: [
      {
        id: `decision-health-${criticalDimension.id}-review`,
        title: "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·آ§ط¸â€‍ط·آ¨ط·آ¹ط·آ¯ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹",
        description:
          criticalDimension.explanation,
        sequence: 1,
        required: true,
      },
      {
        id: `decision-health-${criticalDimension.id}-plan`,
        title: "ط·آ§ط·آ¹ط·ع¾ط¸â€¦ط·آ§ط·آ¯ ط·آ®ط·آ·ط·آ© ط·ع¾ط·آ­ط·آ³ط¸ظ¹ط¸â€ ",
        description:
          "ط·ع¾ط·آ­ط·آ¯ط¸ظ¹ط·آ¯ ط·آ§ط¸â€‍ط·آ¥ط·آ¬ط·آ±ط·آ§ط·طŒط·آ§ط·ع¾ ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط·آ³ط·آ¤ط¸ث†ط¸â€‍ط¸ظ¹ط¸â€  ط¸ث†ط·آ§ط¸â€‍ط¸â€¦ط¸ث†ط·آ§ط·آ¹ط¸ظ¹ط·آ¯ ط¸ث†ط¸â€¦ط·آ¤ط·آ´ط·آ±ط·آ§ط·ع¾ ط·آ§ط¸â€‍ط¸â€ڑط¸ظ¹ط·آ§ط·آ³.",
        sequence: 2,
        required: true,
      },
      {
        id: `decision-health-${criticalDimension.id}-monitor`,
        title: "ط¸â€¦ط·ع¾ط·آ§ط·آ¨ط·آ¹ط·آ© ط·آ£ط·آ«ط·آ± ط·آ§ط¸â€‍ط¸â€ڑط·آ±ط·آ§ط·آ±",
        description:
          "ط¸â€¦ط·آ±ط·آ§ط·آ¬ط·آ¹ط·آ© ط·ع¾ط·ط›ط¸ظ¹ط·آ± ط¸â€ ط·ع¾ط¸ظ¹ط·آ¬ط·آ© ط·آ§ط¸â€‍ط·آ¨ط·آ¹ط·آ¯ ط·آ§ط¸â€‍ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ°ط¸ظ¹ ط·آ¨ط·آ¹ط·آ¯ ط·ع¾ط¸â€ ط¸ظ¾ط¸ظ¹ط·آ° ط·آ§ط¸â€‍ط·آ¥ط·آ¬ط·آ±ط·آ§ط·طŒط·آ§ط·ع¾.",
        sequence: 3,
        required: true,
      },
    ],
    generatedAt: kpiSnapshot.generatedAt,
  };
}

function buildSummary(
  recommendations: ExecutiveDecisionRecommendation[],
): ExecutiveDecisionSummary {
  const totalConfidence = recommendations.reduce(
    (sum, recommendation) =>
      sum + recommendation.confidence.score,
    0,
  );

  const totalImpact = recommendations.reduce(
    (sum, recommendation) =>
      sum + recommendation.impact.overall,
    0,
  );

  return {
    total: recommendations.length,
    immediate: recommendations.filter(
      (recommendation) =>
        recommendation.urgency === "immediate",
    ).length,
    today: recommendations.filter(
      (recommendation) =>
        recommendation.urgency === "today",
    ).length,
    thisWeek: recommendations.filter(
      (recommendation) =>
        recommendation.urgency === "this_week",
    ).length,
    monitor: recommendations.filter(
      (recommendation) =>
        recommendation.urgency === "monitor",
    ).length,
    critical: recommendations.filter(
      (recommendation) =>
        recommendation.priority === "critical",
    ).length,
    high: recommendations.filter(
      (recommendation) =>
        recommendation.priority === "high",
    ).length,
    averageConfidence:
      recommendations.length > 0
        ? Math.round(
            totalConfidence /
              recommendations.length,
          )
        : 0,
    averageImpact:
      recommendations.length > 0
        ? Math.round(
            totalImpact /
              recommendations.length,
          )
        : 0,
  };
}

export function createExecutiveDecisionSnapshot(
  kpiSnapshot: ExecutiveKpiSnapshot,
  alertSnapshot: ExecutiveAlertSnapshot,
  briefing: ExecutiveBriefing,
): ExecutiveDecisionSnapshot {
  const alertRecommendations =
    alertSnapshot.alerts
      .map((alert) =>
        createRecommendation(
          alert,
          kpiSnapshot,
          briefing,
        ),
      )
      .sort(
        (first, second) =>
          second.score - first.score,
      );

  const healthRecommendation =
    createHealthRecommendation(
      kpiSnapshot,
      briefing,
    );

  const recommendations = [
    ...alertRecommendations,
    ...(healthRecommendation
      ? [healthRecommendation]
      : []),
  ]
    .filter(
      (
        recommendation,
        index,
        collection,
      ) =>
        collection.findIndex(
          (candidate) =>
            candidate.category ===
              recommendation.category &&
            candidate.title ===
              recommendation.title,
        ) === index,
    )
    .sort(
      (first, second) =>
        second.score - first.score,
    )
    .slice(0, 10);

  return {
    generatedAt: kpiSnapshot.generatedAt,
    organizationHealth: {
      score: kpiSnapshot.health.score,
      status: kpiSnapshot.health.status,
    },
    recommendations,
    summary: buildSummary(recommendations),
    primaryRecommendation:
      recommendations[0],
  };
}