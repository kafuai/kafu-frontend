import type {
  DealRiskCategory,
  DealRiskContext,
  DealRiskLevel,
  DealRiskSignalKey,
  DealRiskSignalResult,
} from "./DealRiskTypes";

export interface DealRiskSignalDefinition {
  key: DealRiskSignalKey;
  category: DealRiskCategory;
  label: string;
  defaultWeight: number;

  evaluate(
    context: DealRiskContext,
    weight: number,
  ): DealRiskSignalResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number =>
  Math.min(maximum, Math.max(minimum, value));

const round = (
  value: number,
  precision = 2,
): number => {
  const multiplier = 10 ** precision;

  return (
    Math.round(value * multiplier)
    / multiplier
  );
};

const normalizePercent = (
  value: number | null | undefined,
): number | null => {
  if (
    value === null
    || value === undefined
    || !Number.isFinite(value)
  ) {
    return null;
  }

  return clamp(
    value <= 1
      ? value * 100
      : value,
  );
};

const resolveSeverity = (
  riskScore: number,
): DealRiskLevel => {
  if (riskScore >= 80) {
    return "critical";
  }

  if (riskScore >= 60) {
    return "high";
  }

  if (riskScore >= 35) {
    return "moderate";
  }

  return "low";
};

const createUnavailableSignal = (
  key: DealRiskSignalKey,
  category: DealRiskCategory,
  label: string,
  weight: number,
  reason: string,
): DealRiskSignalResult => ({
  key,
  category,
  label,

  riskScore: 0,
  severity: "low",

  weight,
  weightedRisk: 0,

  confidence: 0,
  available: false,

  reason,
  evidence: [],
});

const createSignal = (
  key: DealRiskSignalKey,
  category: DealRiskCategory,
  label: string,
  riskScore: number,
  weight: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
  recommendedAction?: string,
): DealRiskSignalResult => {
  const normalizedRisk = clamp(riskScore);

  return {
    key,
    category,
    label,

    riskScore: round(normalizedRisk),
    severity: resolveSeverity(normalizedRisk),

    weight,
    weightedRisk:
      round(normalizedRisk * weight, 4),

    confidence:
      round(clamp(confidence)),

    available: true,

    reason,
    evidence,
    recommendedAction,
  };
};

const engagementDeclineSignal:
  DealRiskSignalDefinition = {
    key: "engagementDecline",
    category: "engagement",
    label: "Engagement Decline",
    defaultWeight: 1.15,

    evaluate(context, weight) {
      const engagementScore =
        normalizePercent(
          context.engagementScore,
        );

      if (engagementScore === null) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Customer engagement evidence is unavailable.",
        );
      }

      const trendPenalty =
        context.engagementTrend === "declining"
          ? 25
          : context.engagementTrend === "improving"
            ? -15
            : 0;

      const riskScore =
        clamp(
          100
          - engagementScore
          + trendPenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        85,
        context.engagementTrend === "declining"
          ? "Customer engagement is declining."
          : engagementScore < 50
            ? "Customer engagement remains weak."
            : "Customer engagement is currently stable.",
        [
          `Engagement score: ${engagementScore}`,
          `Engagement trend: ${context.engagementTrend ?? "stable"}`,
        ],
        riskScore >= 60
          ? "Re-establish customer engagement and secure a dated next commitment."
          : undefined,
      );
    },
  };

const activityInactivitySignal:
  DealRiskSignalDefinition = {
    key: "activityInactivity",
    category: "activity",
    label: "Sales Inactivity",
    defaultWeight: 1.1,

    evaluate(context, weight) {
      const daysSinceLastActivity =
        context.daysSinceLastActivity;

      if (
        daysSinceLastActivity === null
        || daysSinceLastActivity === undefined
        || !Number.isFinite(daysSinceLastActivity)
        || daysSinceLastActivity < 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Recent sales-activity evidence is unavailable.",
        );
      }

      const activityCount =
        Math.max(
          0,
          context.activityCount30Days ?? 0,
        );

      const recencyRisk =
        daysSinceLastActivity <= 3
          ? 5
          : daysSinceLastActivity <= 7
            ? 20
            : daysSinceLastActivity <= 14
              ? 45
              : daysSinceLastActivity <= 30
                ? 70
                : 95;

      const frequencyPenalty =
        activityCount >= 8
          ? -10
          : activityCount >= 4
            ? 0
            : activityCount >= 2
              ? 10
              : 20;

      const riskScore =
        clamp(
          recencyRisk
          + frequencyPenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        90,
        daysSinceLastActivity <= 7
          ? "The opportunity has recent sales activity."
          : "The opportunity is showing material inactivity.",
        [
          `Days since last activity: ${daysSinceLastActivity}`,
          `Activities in 30 days: ${activityCount}`,
        ],
        riskScore >= 60
          ? "Initiate immediate outreach and document the next customer action."
          : undefined,
      );
    },
  };

const stakeholderCoverageSignal:
  DealRiskSignalDefinition = {
    key: "stakeholderCoverage",
    category: "stakeholder",
    label: "Stakeholder Coverage",
    defaultWeight: 0.95,

    evaluate(context, weight) {
      const stakeholderCount =
        context.stakeholderCount;

      const engagedStakeholderCount =
        context.engagedStakeholderCount;

      if (
        stakeholderCount === null
        || stakeholderCount === undefined
        || engagedStakeholderCount === null
        || engagedStakeholderCount === undefined
        || !Number.isFinite(stakeholderCount)
        || !Number.isFinite(
          engagedStakeholderCount,
        )
        || stakeholderCount < 0
        || engagedStakeholderCount < 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Stakeholder coverage evidence is unavailable.",
        );
      }

      if (stakeholderCount === 0) {
        return createSignal(
          this.key,
          this.category,
          this.label,
          100,
          weight,
          95,
          "No opportunity stakeholders have been identified.",
          [
            "Stakeholder count: 0",
            "Engaged stakeholder count: 0",
          ],
          "Identify and map all commercial, technical, and executive stakeholders.",
        );
      }

      const coverageRatio =
        Math.min(
          1,
          engagedStakeholderCount
          / stakeholderCount,
        );

      const singleThreadPenalty =
        engagedStakeholderCount <= 1
          ? 25
          : 0;

      const riskScore =
        clamp(
          100
          - coverageRatio * 100
          + singleThreadPenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        90,
        riskScore >= 60
          ? "The deal is under-connected across customer stakeholders."
          : "Stakeholder engagement coverage is acceptable.",
        [
          `Identified stakeholders: ${stakeholderCount}`,
          `Engaged stakeholders: ${engagedStakeholderCount}`,
          `Coverage ratio: ${round(coverageRatio * 100)}%`,
        ],
        riskScore >= 60
          ? "Expand stakeholder coverage and reduce single-thread dependency."
          : undefined,
      );
    },
  };

const decisionMakerAccessSignal:
  DealRiskSignalDefinition = {
    key: "decisionMakerAccess",
    category: "stakeholder",
    label: "Decision-Maker Access",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      if (
        context.decisionMakerIdentified
        === null
        || context.decisionMakerIdentified
          === undefined
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Decision-maker evidence is unavailable.",
        );
      }

      const riskScore =
        !context.decisionMakerIdentified
          ? 100
          : context.decisionMakerEngaged
            ? 10
            : 75;

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        95,
        !context.decisionMakerIdentified
          ? "The economic or final decision maker has not been identified."
          : context.decisionMakerEngaged
            ? "The decision maker is actively engaged."
            : "The decision maker is identified but not yet engaged.",
        [
          `Decision maker identified: ${context.decisionMakerIdentified}`,
          `Decision maker engaged: ${context.decisionMakerEngaged ?? false}`,
          `Champion identified: ${context.championIdentified ?? false}`,
        ],
        riskScore >= 60
          ? "Secure direct access to the decision maker and validate approval criteria."
          : undefined,
      );
    },
  };

const closeDateInstabilitySignal:
  DealRiskSignalDefinition = {
    key: "closeDateInstability",
    category: "timeline",
    label: "Close-Date Instability",
    defaultWeight: 1.05,

    evaluate(context, weight) {
      if (!context.expectedCloseDate) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Expected close date is unavailable.",
        );
      }

      const closeDate =
        new Date(context.expectedCloseDate);

      if (
        Number.isNaN(closeDate.getTime())
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Expected close date is invalid.",
        );
      }

      const changeCount =
        Math.max(
          0,
          context.closeDateChangeCount ?? 0,
        );

      const pastDuePenalty =
        context.expectedCloseDatePastDue
          ? 35
          : 0;

      const riskScore =
        clamp(
          changeCount * 18
          + pastDuePenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        85,
        context.expectedCloseDatePastDue
          ? "The expected close date is overdue."
          : changeCount >= 3
            ? "Repeated close-date changes indicate timeline uncertainty."
            : "The expected close date is relatively stable.",
        [
          `Expected close date: ${closeDate.toISOString()}`,
          `Close-date changes: ${changeCount}`,
          `Past due: ${context.expectedCloseDatePastDue ?? false}`,
        ],
        riskScore >= 60
          ? "Revalidate the customer timeline, approval path, and commercial close plan."
          : undefined,
      );
    },
  };

const stageStagnationSignal:
  DealRiskSignalDefinition = {
    key: "stageStagnation",
    category: "timeline",
    label: "Stage Stagnation",
    defaultWeight: 1,

    evaluate(context, weight) {
      const daysInCurrentStage =
        context.daysInCurrentStage;

      if (
        daysInCurrentStage === null
        || daysInCurrentStage === undefined
        || !Number.isFinite(daysInCurrentStage)
        || daysInCurrentStage < 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Stage-duration evidence is unavailable.",
        );
      }

      const riskScore =
        daysInCurrentStage <= 7
          ? 5
          : daysInCurrentStage <= 14
            ? 20
            : daysInCurrentStage <= 30
              ? 45
              : daysInCurrentStage <= 60
                ? 75
                : 95;

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        85,
        daysInCurrentStage <= 30
          ? "The opportunity is progressing within an acceptable stage duration."
          : "The opportunity has remained in its current stage too long.",
        [
          `Stage: ${context.stage ?? "unknown"}`,
          `Days in current stage: ${daysInCurrentStage}`,
        ],
        riskScore >= 60
          ? "Define and execute the exit criteria required to advance the opportunity."
          : undefined,
      );
    },
  };

const commercialFrictionSignal:
  DealRiskSignalDefinition = {
    key: "commercialFriction",
    category: "commercial",
    label: "Commercial Friction",
    defaultWeight: 1.05,

    evaluate(context, weight) {
      const discountPercent =
        normalizePercent(
          context.discountPercent,
        );

      const objectionCount =
        context.commercialObjectionCount;

      const hasAnyEvidence =
        discountPercent !== null
        || (
          objectionCount !== null
          && objectionCount !== undefined
        )
        || context.procurementBlocker !== null
        || context.procurementBlocker
          !== undefined
        || context.legalBlocker !== null
        || context.legalBlocker !== undefined;

      if (!hasAnyEvidence) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Commercial-risk evidence is unavailable.",
        );
      }

      const discountRisk =
        discountPercent === null
          ? 0
          : discountPercent >= 40
            ? 45
            : discountPercent >= 25
              ? 30
              : discountPercent >= 15
                ? 15
                : 0;

      const objectionRisk =
        Math.min(
          30,
          Math.max(
            0,
            objectionCount ?? 0,
          ) * 8,
        );

      const blockerRisk =
        (
          context.procurementBlocker
            ? 20
            : 0
        )
        + (
          context.legalBlocker
            ? 20
            : 0
        );

      const riskScore =
        clamp(
          discountRisk
          + objectionRisk
          + blockerRisk,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        85,
        riskScore >= 60
          ? "Commercial objections or approval blockers threaten the deal."
          : "Commercial friction remains manageable.",
        [
          `Discount percent: ${discountPercent ?? "unknown"}`,
          `Commercial objections: ${objectionCount ?? "unknown"}`,
          `Procurement blocker: ${context.procurementBlocker ?? false}`,
          `Legal blocker: ${context.legalBlocker ?? false}`,
        ],
        riskScore >= 60
          ? "Resolve commercial blockers and confirm the approval path with accountable owners."
          : undefined,
      );
    },
  };

const competitivePressureSignal:
  DealRiskSignalDefinition = {
    key: "competitivePressure",
    category: "competition",
    label: "Competitive Pressure",
    defaultWeight: 0.9,

    evaluate(context, weight) {
      const competitorCount =
        context.competitorCount;

      const positionScore =
        normalizePercent(
          context.competitivePositionScore,
        );

      if (
        competitorCount === null
        && positionScore === null
        && context.primaryCompetitorIdentified
          === null
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Competitive evidence is unavailable.",
        );
      }

      const countRisk =
        Math.min(
          35,
          Math.max(
            0,
            competitorCount ?? 0,
          ) * 10,
        );

      const positionRisk =
        positionScore === null
          ? 20
          : 100 - positionScore;

      const unknownCompetitorPenalty =
        (
          competitorCount
          && competitorCount > 0
          && !context.primaryCompetitorIdentified
        )
          ? 15
          : 0;

      const riskScore =
        clamp(
          positionRisk * 0.7
          + countRisk
          + unknownCompetitorPenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        75,
        riskScore >= 60
          ? "Competitive pressure is materially reducing the probability of success."
          : "Competitive exposure is currently controlled.",
        [
          `Competitor count: ${competitorCount ?? "unknown"}`,
          `Primary competitor identified: ${context.primaryCompetitorIdentified ?? false}`,
          `Competitive position score: ${positionScore ?? "unknown"}`,
        ],
        riskScore >= 60
          ? "Strengthen competitive differentiation and validate the customer decision criteria."
          : undefined,
      );
    },
  };

const qualificationWeaknessSignal:
  DealRiskSignalDefinition = {
    key: "qualificationWeakness",
    category: "qualification",
    label: "Qualification Weakness",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      const qualificationScore =
        normalizePercent(
          context.qualificationScore,
        );

      const qualificationEvidence = [
        context.businessNeedConfirmed,
        context.budgetConfirmed,
        context.timelineConfirmed,
      ].filter(
        (value) =>
          value !== null
          && value !== undefined,
      );

      if (
        qualificationScore === null
        && qualificationEvidence.length === 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Opportunity qualification evidence is unavailable.",
        );
      }

      const confirmationScore =
        qualificationEvidence.length === 0
          ? 50
          : (
              qualificationEvidence.filter(
                Boolean,
              ).length
              / qualificationEvidence.length
            ) * 100;

      const effectiveQualification =
        qualificationScore === null
          ? confirmationScore
          : (
              qualificationScore * 0.65
              + confirmationScore * 0.35
            );

      const riskScore =
        100 - effectiveQualification;

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        90,
        riskScore >= 60
          ? "Critical qualification criteria remain unconfirmed."
          : "Opportunity qualification is sufficiently supported.",
        [
          `Qualification score: ${qualificationScore ?? "unknown"}`,
          `Business need confirmed: ${context.businessNeedConfirmed ?? false}`,
          `Budget confirmed: ${context.budgetConfirmed ?? false}`,
          `Timeline confirmed: ${context.timelineConfirmed ?? false}`,
        ],
        riskScore >= 60
          ? "Requalify business need, budget, timing, authority, and measurable success criteria."
          : undefined,
      );
    },
  };

const forecastDeteriorationSignal:
  DealRiskSignalDefinition = {
    key: "forecastDeterioration",
    category: "forecast",
    label: "Forecast Deterioration",
    defaultWeight: 1.25,

    evaluate(context, weight) {
      const probability =
        context.winProbability.probability;

      const probabilityRisk =
        100 - probability;

      const trendPenalty =
        context.winProbability.trend
          === "declining"
          ? 20
          : context.winProbability.trend
            === "improving"
            ? -10
            : 0;

      const opportunityRiskPenalty =
        context.opportunityScore.riskLevel
          === "critical"
          ? 25
          : context.opportunityScore.riskLevel
            === "high"
            ? 15
            : context.opportunityScore.riskLevel
              === "moderate"
              ? 5
              : 0;

      const riskScore =
        clamp(
          probabilityRisk * 0.75
          + trendPenalty
          + opportunityRiskPenalty,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        (
          context.winProbability.confidence
          + context.opportunityScore.confidence
        ) / 2,
        riskScore >= 60
          ? "Predictive opportunity indicators are deteriorating."
          : "Predictive opportunity indicators remain acceptable.",
        [
          `Win probability: ${probability}`,
          `Probability trend: ${context.winProbability.trend}`,
          `Opportunity score: ${context.opportunityScore.score}`,
          `Opportunity risk: ${context.opportunityScore.riskLevel}`,
        ],
        riskScore >= 60
          ? "Review the predictive drivers and execute a documented recovery plan."
          : undefined,
      );
    },
  };

const revenueExposureSignal:
  DealRiskSignalDefinition = {
    key: "revenueExposure",
    category: "concentration",
    label: "Revenue Exposure",
    defaultWeight: 1.1,

    evaluate(context, weight) {
      const prediction =
        context.revenuePrediction;

      if (!prediction) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Revenue-prediction evidence is unavailable.",
        );
      }

      const realizationRatio =
        context.dealValue <= 0
          ? 0
          : prediction.predictedRevenue
            / context.dealValue;

      const predictionRisk =
        prediction.riskLevel === "critical"
          ? 40
          : prediction.riskLevel === "high"
            ? 25
            : prediction.riskLevel === "moderate"
              ? 10
              : 0;

      const confidenceRisk =
        100 - prediction.confidence;

      const realizationRisk =
        100
        - clamp(
            realizationRatio * 100,
          );

      const riskScore =
        clamp(
          realizationRisk * 0.45
          + confidenceRisk * 0.3
          + predictionRisk,
        );

      return createSignal(
        this.key,
        this.category,
        this.label,
        riskScore,
        weight,
        prediction.confidence,
        riskScore >= 60
          ? "A material portion of the opportunity value is unlikely to be realized."
          : "Expected revenue realization remains acceptable.",
        [
          `Deal value: ${context.dealValue}`,
          `Predicted revenue: ${prediction.predictedRevenue}`,
          `Revenue confidence: ${prediction.confidence}`,
          `Revenue risk: ${prediction.riskLevel}`,
        ],
        riskScore >= 60
          ? "Revalidate the expected revenue, commercial timing, and recovery assumptions."
          : undefined,
      );
    },
  };

const deliveryDependencySignal:
  DealRiskSignalDefinition = {
    key: "deliveryDependency",
    category: "delivery",
    label: "Delivery Dependency",
    defaultWeight: 0.85,

    evaluate(context, weight) {
      const dependencyCount =
        context.implementationDependencyCount;

      const unresolvedCount =
        context.unresolvedDependencyCount;

      const deliveryRisk =
        normalizePercent(
          context.deliveryRiskScore,
        );

      if (
        dependencyCount === null
        && unresolvedCount === null
        && deliveryRisk === null
      ) {
        return createUnavailableSignal(
          this.key,
          this.category,
          this.label,
          weight,
          "Delivery-dependency evidence is unavailable.",
        );
      }

      const unresolvedRatio =
        dependencyCount
        && dependencyCount > 0
          ? Math.min(
              1,
              Math.max(
                0,
                unresolvedCount ?? 0,
              ) / dependencyCount,
            )
          : unresolvedCount
            && unresolvedCount > 0
              ? 1
              : 0;

      const dependencyRisk =
        unresolvedRatio * 100;

      const effectiveRisk =
        deliveryRisk === null
          ? dependencyRisk
          : (
              deliveryRisk * 0.65
              + dependencyRisk * 0.35
            );

      return createSignal(
        this.key,
        this.category,
        this.label,
        effectiveRisk,
        weight,
        80,
        effectiveRisk >= 60
          ? "Unresolved delivery dependencies threaten commercial confidence."
          : "Delivery dependencies remain controlled.",
        [
          `Implementation dependencies: ${dependencyCount ?? "unknown"}`,
          `Unresolved dependencies: ${unresolvedCount ?? "unknown"}`,
          `Delivery risk score: ${deliveryRisk ?? "unknown"}`,
        ],
        effectiveRisk >= 60
          ? "Assign accountable owners and resolution dates to all critical dependencies."
          : undefined,
      );
    },
  };

export const dealRiskSignals:
  readonly DealRiskSignalDefinition[] = [
    engagementDeclineSignal,
    activityInactivitySignal,
    stakeholderCoverageSignal,
    decisionMakerAccessSignal,
    closeDateInstabilitySignal,
    stageStagnationSignal,
    commercialFrictionSignal,
    competitivePressureSignal,
    qualificationWeaknessSignal,
    forecastDeteriorationSignal,
    revenueExposureSignal,
    deliveryDependencySignal,
  ];

export const createDealRiskSignals = (
  weightOverrides: Partial<
    Record<DealRiskSignalKey, number>
  > = {},
): readonly DealRiskSignalDefinition[] =>
  dealRiskSignals.map((signal) => ({
    ...signal,
    defaultWeight:
      weightOverrides[signal.key]
      ?? signal.defaultWeight,
  }));
