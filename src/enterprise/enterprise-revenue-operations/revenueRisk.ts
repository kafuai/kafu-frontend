import type {
  RevenueRiskLevel,
  RevenueRiskSignal,
  RevenueSignalKind,
} from "./revenueOperationsTypes";
import type {
  RevenuePipelineOpportunity,
} from "./revenuePipeline";

export interface RevenueRiskAssessment {
  id: string;
  accountId: string;
  opportunityId?: string;
  level: RevenueRiskLevel;
  score?: number;
  reason: string;
  mitigation: string;
  signals?: RevenueRiskSignal[];
  assessedAt?: string;
}

export interface RevenueRiskPolicy {
  criticalScore: number;
  highScore: number;
  mediumScore: number;
  stalledStageDays: number;
  inactivityDays: number;
  closeDateWarningDays: number;
  minimumProbability: number;
}

export const DEFAULT_REVENUE_RISK_POLICY: RevenueRiskPolicy = {
  criticalScore: 80,
  highScore: 60,
  mediumScore: 35,
  stalledStageDays: 30,
  inactivityDays: 14,
  closeDateWarningDays: 7,
  minimumProbability: 0.25,
};

function daysBetween(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 0;
  }

  return (endTime - startTime) / 86_400_000;
}

function normalizeProbability(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value > 1 ? value / 100 : value));
}

function resolveRiskLevel(
  score: number,
  policy: RevenueRiskPolicy,
): RevenueRiskLevel {
  if (score >= policy.criticalScore) {
    return "critical";
  }

  if (score >= policy.highScore) {
    return "high";
  }

  if (score >= policy.mediumScore) {
    return "medium";
  }

  return "low";
}

function createSignal(input: {
  opportunity: RevenuePipelineOpportunity;
  kind: RevenueSignalKind;
  score: number;
  title: string;
  description: string;
  recommendedAction: string;
  detectedAt: string;
  policy: RevenueRiskPolicy;
  metadata?: Record<string, unknown>;
}): RevenueRiskSignal {
  return {
    id: `${input.opportunity.id}-${input.kind}`,
    opportunityId: input.opportunity.id,
    accountId: input.opportunity.accountId ?? null,
    kind: input.kind,
    level: resolveRiskLevel(input.score, input.policy),
    status: "open",
    title: input.title,
    description: input.description,
    recommendedAction: input.recommendedAction,
    score: input.score,
    detectedAt: input.detectedAt,
    metadata: input.metadata ?? {},
  };
}

export function detectOpportunityRevenueRisks(
  opportunity: RevenuePipelineOpportunity,
  options?: {
    asOf?: string;
    stageProbability?: number;
    policy?: Partial<RevenueRiskPolicy>;
  },
): RevenueRiskSignal[] {
  const detectedAt = options?.asOf ?? new Date().toISOString();

  const policy: RevenueRiskPolicy = {
    ...DEFAULT_REVENUE_RISK_POLICY,
    ...options?.policy,
  };

  const signals: RevenueRiskSignal[] = [];

  const closeDateDistance = daysBetween(
    detectedAt,
    opportunity.expectedCloseDate,
  );

  if (closeDateDistance < 0) {
    signals.push(
      createSignal({
        opportunity,
        kind: "close_date",
        score: 90,
        title: "Expected close date has passed",
        description:
          "The opportunity remains open after its expected close date.",
        recommendedAction:
          "Revalidate the close plan, decision process, and expected close date.",
        detectedAt,
        policy,
        metadata: {
          expectedCloseDate: opportunity.expectedCloseDate,
          overdueDays: Math.abs(closeDateDistance),
        },
      }),
    );
  } else if (closeDateDistance <= policy.closeDateWarningDays) {
    signals.push(
      createSignal({
        opportunity,
        kind: "close_date",
        score: 55,
        title: "Close date is approaching",
        description:
          "The opportunity is nearing its expected close date and requires confirmation.",
        recommendedAction:
          "Confirm remaining approval, commercial, and contracting steps.",
        detectedAt,
        policy,
        metadata: {
          expectedCloseDate: opportunity.expectedCloseDate,
          remainingDays: closeDateDistance,
        },
      }),
    );
  }

  if (opportunity.stageEnteredAt) {
    const stageAge = daysBetween(
      opportunity.stageEnteredAt,
      detectedAt,
    );

    if (stageAge >= policy.stalledStageDays) {
      signals.push(
        createSignal({
          opportunity,
          kind: "stalled_stage",
          score: stageAge >= policy.stalledStageDays * 2 ? 80 : 60,
          title: "Opportunity is stalled in its current stage",
          description:
            "The opportunity has remained in the current stage beyond the accepted threshold.",
          recommendedAction:
            "Review stage exit criteria and assign a dated recovery action.",
          detectedAt,
          policy,
          metadata: {
            stageId: opportunity.stageId,
            daysInStage: stageAge,
          },
        }),
      );
    }
  }

  const probability = normalizeProbability(
    options?.stageProbability ?? 0,
  );

  if (
    opportunity.forecastCategory === "commit" &&
    probability < policy.minimumProbability
  ) {
    signals.push(
      createSignal({
        opportunity,
        kind: "low_probability",
        score: 75,
        title: "Commit opportunity has low probability",
        description:
          "The opportunity is categorized as commit but its stage probability is below policy.",
        recommendedAction:
          "Reassess forecast category or establish evidence supporting commit confidence.",
        detectedAt,
        policy,
        metadata: {
          probability,
          forecastCategory: opportunity.forecastCategory,
        },
      }),
    );
  }

  if (!opportunity.nextActionDueAt) {
    signals.push(
      createSignal({
        opportunity,
        kind: "missing_next_action",
        score: 50,
        title: "No next action is scheduled",
        description:
          "The opportunity has no dated next action assigned.",
        recommendedAction:
          "Create a specific owner-assigned next action with a due date.",
        detectedAt,
        policy,
      }),
    );
  } else if (
    new Date(opportunity.nextActionDueAt).getTime() <
    new Date(detectedAt).getTime()
  ) {
    signals.push(
      createSignal({
        opportunity,
        kind: "overdue_next_action",
        score: 65,
        title: "Next action is overdue",
        description:
          "The current next action has passed its due date without completion.",
        recommendedAction:
          "Complete, reschedule, or replace the overdue next action.",
        detectedAt,
        policy,
        metadata: {
          nextActionDueAt: opportunity.nextActionDueAt,
        },
      }),
    );
  }

  if (opportunity.lastActivityAt) {
    const inactivityDays = daysBetween(
      opportunity.lastActivityAt,
      detectedAt,
    );

    if (inactivityDays >= policy.inactivityDays) {
      signals.push(
        createSignal({
          opportunity,
          kind: "low_activity",
          score:
            inactivityDays >= policy.inactivityDays * 2 ? 75 : 55,
          title: "Opportunity engagement is declining",
          description:
            "No meaningful activity has been recorded within the acceptable engagement period.",
          recommendedAction:
            "Initiate a customer-facing engagement and validate deal momentum.",
          detectedAt,
          policy,
          metadata: {
            lastActivityAt: opportunity.lastActivityAt,
            inactivityDays,
          },
        }),
      );
    }
  }

  return signals.sort((first, second) => second.score - first.score);
}

export function assessOpportunityRevenueRisk(
  opportunity: RevenuePipelineOpportunity,
  options?: {
    asOf?: string;
    stageProbability?: number;
    policy?: Partial<RevenueRiskPolicy>;
  },
): RevenueRiskAssessment {
  const signals = detectOpportunityRevenueRisks(opportunity, options);
  const score = Math.min(
    100,
    signals.reduce(
      (total, signal) => total + signal.score * 0.35,
      0,
    ),
  );

  const policy: RevenueRiskPolicy = {
    ...DEFAULT_REVENUE_RISK_POLICY,
    ...options?.policy,
  };

  const level = resolveRiskLevel(score, policy);
  const highestSignal = signals[0];

  return {
    id: `revenue-risk-${opportunity.id}`,
    accountId: opportunity.accountId ?? opportunity.accountName,
    opportunityId: opportunity.id,
    level,
    score,
    reason:
      highestSignal?.description ??
      "No material revenue risk signals were detected.",
    mitigation:
      highestSignal?.recommendedAction ??
      "Continue monitoring opportunity progression and engagement.",
    signals,
    assessedAt: options?.asOf ?? new Date().toISOString(),
  };
}

export function isCriticalRevenueRisk(
  risk: RevenueRiskAssessment,
): boolean {
  return risk.level === "critical";
}