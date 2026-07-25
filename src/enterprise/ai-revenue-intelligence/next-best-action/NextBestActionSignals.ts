import type {
  NextBestActionCandidate,
  NextBestActionContext,
  NextBestActionPriority,
  NextBestActionSignalKey,
} from "./NextBestActionTypes";

export interface NextBestActionSignalDefinition {
  key: NextBestActionSignalKey;
  defaultWeight: number;

  evaluate(
    context: NextBestActionContext,
    weight: number,
  ): readonly NextBestActionCandidate[];
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number =>
  Math.min(
    maximum,
    Math.max(minimum, value),
  );

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

const resolvePriority = (
  urgencyScore: number,
  impactScore: number,
  relatedRiskLevel?:
    "low" | "moderate" | "high" | "critical",
): NextBestActionPriority => {
  if (
    relatedRiskLevel === "critical"
    || urgencyScore >= 85
  ) {
    return "urgent";
  }

  if (
    relatedRiskLevel === "high"
    || urgencyScore >= 65
    || impactScore >= 80
  ) {
    return "high";
  }

  if (
    urgencyScore >= 35
    || impactScore >= 50
  ) {
    return "medium";
  }

  return "low";
};

const createCandidate = (
  input: Omit<
    NextBestActionCandidate,
    | "priority"
    | "relevanceScore"
    | "rankScore"
  >,
  weight: number,
): NextBestActionCandidate => {
  const impactScore =
    clamp(input.impactScore);

  const urgencyScore =
    clamp(input.urgencyScore);

  const confidence =
    clamp(input.confidence);

  const effortScore =
    clamp(input.effortScore);

  const relevanceScore =
    clamp(
      (
        impactScore * 0.42
        + urgencyScore * 0.33
        + confidence * 0.25
      ),
    );

  const efficiencyScore =
    100 - effortScore;

  const rankScore =
    clamp(
      (
        relevanceScore * 0.85
        + efficiencyScore * 0.15
      ) * Math.max(0.1, weight),
    );

  return {
    ...input,

    priority:
      resolvePriority(
        urgencyScore,
        impactScore,
        input.relatedRiskLevel,
      ),

    impactScore:
      round(impactScore),

    urgencyScore:
      round(urgencyScore),

    confidence:
      round(confidence),

    effortScore:
      round(effortScore),

    relevanceScore:
      round(relevanceScore),

    rankScore:
      round(rankScore),
  };
};

const findRiskSignal = (
  context: NextBestActionContext,
  signalKey: string,
) =>
  context.dealRisk.breakdown.signals.find(
    (signal) =>
      signal.key === signalKey,
  );

const criticalDealRiskSignal:
  NextBestActionSignalDefinition = {
    key: "criticalDealRisk",
    defaultWeight: 1.25,

    evaluate(context, weight) {
      if (
        !context.dealRisk
          .immediateAttentionRequired
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "executive-escalation",

            title:
              "Escalate the opportunity recovery plan",

            description:
              "Initiate an executive review of the critical risks, owners, recovery actions, and customer commitments.",

            channel: "meeting",

            impactScore:
              Math.max(
                85,
                context.dealRisk.riskScore,
              ),

            urgencyScore: 100,

            confidence:
              context.dealRisk.confidence,

            effortScore: 45,

            dueWithinHours: 4,

            relatedRiskLevel:
              context.dealRisk.riskLevel,

            reason:
              "The opportunity has reached the immediate-attention threshold.",

            evidence: [
              `Deal risk score: ${context.dealRisk.riskScore}`,
              `Critical risks: ${context.dealRisk.criticalRiskCount}`,
              `Active risks: ${context.dealRisk.activeRiskCount}`,
            ],

            expectedOutcome:
              "A documented recovery plan with accountable owners and dates.",

            recommendedOwnerRole:
              "Sales Leader",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const staleActivitySignal:
  NextBestActionSignalDefinition = {
    key: "staleActivity",
    defaultWeight: 1.1,

    evaluate(context, weight) {
      const days =
        context.daysSinceLastActivity;

      if (
        days === null
        || days === undefined
        || !Number.isFinite(days)
        || days <= 7
      ) {
        return [];
      }

      const urgency =
        days >= 30
          ? 95
          : days >= 14
            ? 75
            : 55;

      const riskSignal =
        findRiskSignal(
          context,
          "activityInactivity",
        );

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "customer-outreach",

            title:
              "Re-engage the customer immediately",

            description:
              "Contact the customer using the most effective available channel and secure a dated next step.",

            channel:
              days >= 14
                ? "voice"
                : "email",

            impactScore:
              70
              + Math.min(20, days),

            urgencyScore:
              urgency,

            confidence:
              riskSignal?.confidence
              ?? 80,

            effortScore: 20,

            dueWithinHours:
              days >= 30
                ? 4
                : 24,

            relatedRiskCategory:
              "activity",

            relatedRiskSignal:
              "activityInactivity",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "The opportunity has not received sufficient recent activity.",

            evidence: [
              `Days since last activity: ${days}`,
              `Activities in 30 days: ${context.activityCount30Days ?? 0}`,
            ],

            expectedOutcome:
              "Restored customer engagement and a confirmed next commitment.",

            recommendedOwnerRole:
              "Opportunity Owner",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const decisionMakerGapSignal:
  NextBestActionSignalDefinition = {
    key: "decisionMakerGap",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      if (
        context.decisionMakerIdentified
        && context.decisionMakerEngaged
      ) {
        return [];
      }

      const riskSignal =
        findRiskSignal(
          context,
          "decisionMakerAccess",
        );

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "engage-decision-maker",

            title:
              context.decisionMakerIdentified
                ? "Engage the decision maker"
                : "Identify the decision maker",

            description:
              context.decisionMakerIdentified
                ? "Secure direct engagement with the decision maker and confirm approval criteria."
                : "Map the economic and final decision authority before advancing the opportunity.",

            channel: "meeting",

            impactScore: 90,

            urgencyScore:
              context.dealRisk.riskLevel
                === "critical"
                ? 95
                : 75,

            confidence:
              riskSignal?.confidence
              ?? 85,

            effortScore: 45,

            dueWithinHours:
              context.dealRisk.riskLevel
                === "critical"
                ? 8
                : 48,

            relatedRiskCategory:
              "stakeholder",

            relatedRiskSignal:
              "decisionMakerAccess",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "The decision authority is either unknown or not actively engaged.",

            evidence: [
              `Decision maker identified: ${context.decisionMakerIdentified ?? false}`,
              `Decision maker engaged: ${context.decisionMakerEngaged ?? false}`,
            ],

            expectedOutcome:
              "Validated approval criteria and direct access to decision authority.",

            recommendedOwnerRole:
              "Account Executive",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const stakeholderGapSignal:
  NextBestActionSignalDefinition = {
    key: "stakeholderGap",
    defaultWeight: 0.95,

    evaluate(context, weight) {
      const total =
        context.stakeholderCount;

      const engaged =
        context.engagedStakeholderCount;

      if (
        total === null
        || total === undefined
        || engaged === null
        || engaged === undefined
        || !Number.isFinite(total)
        || !Number.isFinite(engaged)
      ) {
        return [];
      }

      const coverage =
        total <= 0
          ? 0
          : engaged / total;

      if (
        total >= 3
        && coverage >= 0.6
      ) {
        return [];
      }

      const riskSignal =
        findRiskSignal(
          context,
          "stakeholderCoverage",
        );

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "expand-stakeholders",

            title:
              "Expand stakeholder coverage",

            description:
              "Identify and engage commercial, technical, operational, and executive stakeholders.",

            channel: "task",

            impactScore:
              total <= 1
                ? 85
                : 70,

            urgencyScore:
              coverage < 0.3
                ? 80
                : 55,

            confidence:
              riskSignal?.confidence
              ?? 80,

            effortScore: 50,

            dueWithinHours: 48,

            relatedRiskCategory:
              "stakeholder",

            relatedRiskSignal:
              "stakeholderCoverage",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "The opportunity is under-connected across the customer organization.",

            evidence: [
              `Identified stakeholders: ${total}`,
              `Engaged stakeholders: ${engaged}`,
              `Coverage: ${round(coverage * 100)}%`,
            ],

            expectedOutcome:
              "Broader customer alignment and reduced single-thread dependency.",

            recommendedOwnerRole:
              "Opportunity Owner",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const qualificationGapSignal:
  NextBestActionSignalDefinition = {
    key: "qualificationGap",
    defaultWeight: 1.1,

    evaluate(context, weight) {
      const missing = [
        !context.businessNeedConfirmed
          ? "business need"
          : null,

        !context.budgetConfirmed
          ? "budget"
          : null,

        !context.timelineConfirmed
          ? "timeline"
          : null,
      ].filter(
        (value): value is string =>
          Boolean(value),
      );

      if (missing.length === 0) {
        return [];
      }

      const riskSignal =
        findRiskSignal(
          context,
          "qualificationWeakness",
        );

      const candidates:
        NextBestActionCandidate[] = [];

      candidates.push(
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "requalify-opportunity",

            title:
              "Requalify the opportunity",

            description:
              "Run a structured qualification review and confirm all missing commercial criteria.",

            channel: "meeting",

            impactScore:
              75 + missing.length * 5,

            urgencyScore:
              context.winProbability.probability
                < 50
                ? 80
                : 60,

            confidence:
              riskSignal?.confidence
              ?? 85,

            effortScore: 40,

            dueWithinHours: 48,

            relatedRiskCategory:
              "qualification",

            relatedRiskSignal:
              "qualificationWeakness",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "Core qualification criteria remain unconfirmed.",

            evidence: [
              `Missing qualification criteria: ${missing.join(", ")}`,
              `Opportunity score: ${context.opportunityScore.score}`,
              `Win probability: ${context.winProbability.probability}`,
            ],

            expectedOutcome:
              "A validated opportunity qualification baseline and clear go/no-go decision.",

            recommendedOwnerRole:
              "Account Executive",

            requiresApproval: false,
          },
          weight,
        ),
      );

      if (!context.budgetConfirmed) {
        candidates.push(
          createCandidate(
            {
              signalKey: this.key,

              actionType:
                "validate-budget",

              title:
                "Validate customer budget",

              description:
                "Confirm budget ownership, available amount, approval timing, and procurement path.",

              channel: "meeting",

              impactScore: 85,
              urgencyScore: 70,
              confidence: 80,
              effortScore: 35,

              dueWithinHours: 48,

              relatedRiskCategory:
                "qualification",

              relatedRiskSignal:
                "qualificationWeakness",

              relatedRiskLevel:
                riskSignal?.severity,

              reason:
                "Customer budget has not been confirmed.",

              evidence: [
                "Budget confirmed: false",
              ],

              expectedOutcome:
                "Confirmed funding availability and approval path.",

              recommendedOwnerRole:
                "Account Executive",

              requiresApproval: false,
            },
            weight * 0.9,
          ),
        );
      }

      if (!context.timelineConfirmed) {
        candidates.push(
          createCandidate(
            {
              signalKey: this.key,

              actionType:
                "validate-timeline",

              title:
                "Validate the customer timeline",

              description:
                "Confirm the business deadline, buying milestones, and required decision date.",

              channel: "meeting",

              impactScore: 75,
              urgencyScore: 65,
              confidence: 80,
              effortScore: 30,

              dueWithinHours: 48,

              relatedRiskCategory:
                "qualification",

              relatedRiskSignal:
                "qualificationWeakness",

              relatedRiskLevel:
                riskSignal?.severity,

              reason:
                "The customer timeline has not been confirmed.",

              evidence: [
                "Timeline confirmed: false",
              ],

              expectedOutcome:
                "A credible and customer-validated opportunity timeline.",

              recommendedOwnerRole:
                "Opportunity Owner",

              requiresApproval: false,
            },
            weight * 0.85,
          ),
        );
      }

      return candidates;
    },
  };

const commercialBlockerSignal:
  NextBestActionSignalDefinition = {
    key: "commercialBlocker",
    defaultWeight: 1.15,

    evaluate(context, weight) {
      const candidates:
        NextBestActionCandidate[] = [];

      const riskSignal =
        findRiskSignal(
          context,
          "commercialFriction",
        );

      if (context.procurementBlocker) {
        candidates.push(
          createCandidate(
            {
              signalKey: this.key,

              actionType:
                "resolve-procurement-blocker",

              title:
                "Resolve the procurement blocker",

              description:
                "Engage procurement, confirm required documents, and assign owners and deadlines.",

              channel: "meeting",

              impactScore: 90,
              urgencyScore: 90,
              confidence:
                riskSignal?.confidence
                ?? 90,
              effortScore: 55,

              dueWithinHours: 24,

              relatedRiskCategory:
                "commercial",

              relatedRiskSignal:
                "commercialFriction",

              relatedRiskLevel:
                riskSignal?.severity,

              reason:
                "A procurement blocker is preventing commercial progress.",

              evidence: [
                "Procurement blocker: true",
              ],

              expectedOutcome:
                "A clear procurement completion plan with accountable owners.",

              recommendedOwnerRole:
                "Account Executive",

              requiresApproval: false,
            },
            weight,
          ),
        );
      }

      if (context.legalBlocker) {
        candidates.push(
          createCandidate(
            {
              signalKey: this.key,

              actionType:
                "resolve-legal-blocker",

              title:
                "Resolve the legal blocker",

              description:
                "Coordinate legal review, identify unresolved clauses, and agree resolution dates.",

              channel: "meeting",

              impactScore: 90,
              urgencyScore: 90,
              confidence:
                riskSignal?.confidence
                ?? 90,
              effortScore: 60,

              dueWithinHours: 24,

              relatedRiskCategory:
                "commercial",

              relatedRiskSignal:
                "commercialFriction",

              relatedRiskLevel:
                riskSignal?.severity,

              reason:
                "A legal blocker is preventing contract progress.",

              evidence: [
                "Legal blocker: true",
              ],

              expectedOutcome:
                "A dated legal resolution plan and reduced contracting risk.",

              recommendedOwnerRole:
                "Legal or Commercial Owner",

              requiresApproval: true,
            },
            weight,
          ),
        );
      }

      if (
        (context.commercialObjectionCount ?? 0)
        >= 2
      ) {
        candidates.push(
          createCandidate(
            {
              signalKey: this.key,

              actionType:
                "resolve-commercial-blocker",

              title:
                "Resolve commercial objections",

              description:
                "Review objections, quantify their impact, and agree a commercial response strategy.",

              channel: "meeting",

              impactScore: 80,
              urgencyScore: 70,
              confidence:
                riskSignal?.confidence
                ?? 80,
              effortScore: 45,

              dueWithinHours: 48,

              relatedRiskCategory:
                "commercial",

              relatedRiskSignal:
                "commercialFriction",

              relatedRiskLevel:
                riskSignal?.severity,

              reason:
                "Multiple unresolved commercial objections threaten the deal.",

              evidence: [
                `Commercial objections: ${context.commercialObjectionCount}`,
              ],

              expectedOutcome:
                "Resolved objections and customer agreement on commercial terms.",

              recommendedOwnerRole:
                "Sales Leader",

              requiresApproval: true,
            },
            weight * 0.95,
          ),
        );
      }

      return candidates;
    },
  };

const timelineInstabilitySignal:
  NextBestActionSignalDefinition = {
    key: "timelineInstability",
    defaultWeight: 1,

    evaluate(context, weight) {
      const riskSignal =
        findRiskSignal(
          context,
          "closeDateInstability",
        );

      if (
        !riskSignal
        || riskSignal.riskScore < 35
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "update-close-date",

            title:
              "Revalidate the close date",

            description:
              "Confirm the customer decision date, approval milestones, and dependencies before updating the forecast.",

            channel: "meeting",

            impactScore: 75,
            urgencyScore:
              riskSignal.riskScore,
            confidence:
              riskSignal.confidence,
            effortScore: 30,

            dueWithinHours:
              riskSignal.severity
                === "critical"
                ? 12
                : 48,

            relatedRiskCategory:
              "timeline",

            relatedRiskSignal:
              "closeDateInstability",

            relatedRiskLevel:
              riskSignal.severity,

            reason:
              riskSignal.reason,

            evidence:
              riskSignal.evidence,

            expectedOutcome:
              "A customer-validated close date and more reliable forecast.",

            recommendedOwnerRole:
              "Opportunity Owner",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const competitiveThreatSignal:
  NextBestActionSignalDefinition = {
    key: "competitiveThreat",
    defaultWeight: 0.95,

    evaluate(context, weight) {
      const riskSignal =
        findRiskSignal(
          context,
          "competitivePressure",
        );

      if (
        !riskSignal
        || riskSignal.riskScore < 35
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "competitive-response",

            title:
              "Strengthen the competitive response",

            description:
              "Validate customer decision criteria and build a targeted differentiation plan.",

            channel: "meeting",

            impactScore:
              70
              + Math.min(
                  20,
                  context.competitorCount
                    ?? 0,
                ),

            urgencyScore:
              riskSignal.riskScore,

            confidence:
              riskSignal.confidence,

            effortScore: 50,

            dueWithinHours: 48,

            relatedRiskCategory:
              "competition",

            relatedRiskSignal:
              "competitivePressure",

            relatedRiskLevel:
              riskSignal.severity,

            reason:
              riskSignal.reason,

            evidence:
              riskSignal.evidence,

            expectedOutcome:
              "Improved competitive positioning against customer decision criteria.",

            recommendedOwnerRole:
              "Account Executive",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const deliveryDependencySignal:
  NextBestActionSignalDefinition = {
    key: "deliveryDependency",
    defaultWeight: 0.9,

    evaluate(context, weight) {
      const riskSignal =
        findRiskSignal(
          context,
          "deliveryDependency",
        );

      if (
        !riskSignal
        || riskSignal.riskScore < 35
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "reduce-delivery-risk",

            title:
              "Resolve delivery dependencies",

            description:
              "Assign owners and resolution dates to unresolved implementation and delivery dependencies.",

            channel: "task",

            impactScore: 75,

            urgencyScore:
              riskSignal.riskScore,

            confidence:
              riskSignal.confidence,

            effortScore: 55,

            dueWithinHours:
              riskSignal.severity
                === "critical"
                ? 12
                : 72,

            relatedRiskCategory:
              "delivery",

            relatedRiskSignal:
              "deliveryDependency",

            relatedRiskLevel:
              riskSignal.severity,

            reason:
              riskSignal.reason,

            evidence:
              riskSignal.evidence,

            expectedOutcome:
              "Reduced implementation uncertainty and stronger customer confidence.",

            recommendedOwnerRole:
              "Delivery Owner",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const forecastDeteriorationSignal:
  NextBestActionSignalDefinition = {
    key: "forecastDeterioration",
    defaultWeight: 1.15,

    evaluate(context, weight) {
      const riskSignal =
        findRiskSignal(
          context,
          "forecastDeterioration",
        );

      const isDeclining =
        context.winProbability.trend
        === "declining";

      if (
        !isDeclining
        && (
          !riskSignal
          || riskSignal.riskScore < 35
        )
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "forecast-review",

            title:
              "Review the opportunity forecast",

            description:
              "Review probability drivers, revenue assumptions, risk changes, and forecast category.",

            channel: "internal",

            impactScore:
              context.dealValue > 0
                ? 80
                : 65,

            urgencyScore:
              riskSignal?.riskScore
              ?? 65,

            confidence:
              (
                context.winProbability
                  .confidence
                + context.opportunityScore
                  .confidence
              ) / 2,

            effortScore: 30,

            dueWithinHours: 24,

            relatedRiskCategory:
              "forecast",

            relatedRiskSignal:
              "forecastDeterioration",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "Predictive indicators show weakening forecast quality.",

            evidence: [
              `Win probability: ${context.winProbability.probability}`,
              `Win probability trend: ${context.winProbability.trend}`,
              `Opportunity score: ${context.opportunityScore.score}`,
              `Deal risk score: ${context.dealRisk.riskScore}`,
            ],

            expectedOutcome:
              "A more reliable opportunity forecast and documented recovery assumptions.",

            recommendedOwnerRole:
              "Sales Manager",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const stageStagnationSignal:
  NextBestActionSignalDefinition = {
    key: "stageStagnation",
    defaultWeight: 1,

    evaluate(context, weight) {
      const riskSignal =
        findRiskSignal(
          context,
          "stageStagnation",
        );

      if (
        !riskSignal
        || riskSignal.riskScore < 35
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "advance-stage",

            title:
              "Execute the stage exit plan",

            description:
              "Confirm the remaining stage exit criteria and complete the actions required to advance the opportunity.",

            channel: "task",

            impactScore: 70,

            urgencyScore:
              riskSignal.riskScore,

            confidence:
              riskSignal.confidence,

            effortScore: 40,

            dueWithinHours:
              riskSignal.severity
                === "critical"
                ? 12
                : 48,

            relatedRiskCategory:
              "timeline",

            relatedRiskSignal:
              "stageStagnation",

            relatedRiskLevel:
              riskSignal.severity,

            reason:
              riskSignal.reason,

            evidence:
              riskSignal.evidence,

            expectedOutcome:
              "Clear opportunity progression or an evidence-based close decision.",

            recommendedOwnerRole:
              "Opportunity Owner",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

const engagementDeclineSignal:
  NextBestActionSignalDefinition = {
    key: "engagementDecline",
    defaultWeight: 1.05,

    evaluate(context, weight) {
      const engagement =
        normalizePercent(
          context.engagementScore,
        );

      const riskSignal =
        findRiskSignal(
          context,
          "engagementDecline",
        );

      if (
        (
          engagement === null
          || engagement >= 60
        )
        && (
          !riskSignal
          || riskSignal.riskScore < 35
        )
      ) {
        return [];
      }

      return [
        createCandidate(
          {
            signalKey: this.key,

            actionType:
              "recover-engagement",

            title:
              "Recover customer engagement",

            description:
              "Reconfirm customer priorities, present relevant value, and secure an explicit next commitment.",

            channel: "meeting",

            impactScore: 80,

            urgencyScore:
              riskSignal?.riskScore
              ?? (
                engagement === null
                  ? 60
                  : 100 - engagement
              ),

            confidence:
              riskSignal?.confidence
              ?? 75,

            effortScore: 35,

            dueWithinHours: 24,

            relatedRiskCategory:
              "engagement",

            relatedRiskSignal:
              "engagementDecline",

            relatedRiskLevel:
              riskSignal?.severity,

            reason:
              "Customer engagement is below the required level for healthy opportunity progression.",

            evidence: [
              `Engagement score: ${engagement ?? "unknown"}`,
              ...(riskSignal?.evidence ?? []),
            ],

            expectedOutcome:
              "Renewed customer momentum and a confirmed next action.",

            recommendedOwnerRole:
              "Account Executive",

            requiresApproval: false,
          },
          weight,
        ),
      ];
    },
  };

export const nextBestActionSignals:
  readonly NextBestActionSignalDefinition[] = [
    criticalDealRiskSignal,
    staleActivitySignal,
    decisionMakerGapSignal,
    stakeholderGapSignal,
    qualificationGapSignal,
    commercialBlockerSignal,
    timelineInstabilitySignal,
    competitiveThreatSignal,
    deliveryDependencySignal,
    forecastDeteriorationSignal,
    stageStagnationSignal,
    engagementDeclineSignal,
  ];

export const createNextBestActionSignals = (
  weightOverrides: Partial<
    Record<NextBestActionSignalKey, number>
  > = {},
): readonly NextBestActionSignalDefinition[] =>
  nextBestActionSignals.map(
    (signal) => ({
      ...signal,

      defaultWeight:
        weightOverrides[signal.key]
        ?? signal.defaultWeight,
    }),
  );
