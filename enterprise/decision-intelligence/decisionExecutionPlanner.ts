import {
  EnterpriseDecisionPriority,
  EnterpriseDecisionRecommendation,
  EnterpriseDecisionRisk,
} from "./decisionIntelligenceTypes";

export type DecisionExecutionStepStatus =
  | "pending"
  | "ready"
  | "blocked"
  | "completed";

export interface DecisionExecutionStep {
  id: string;
  title: string;
  description: string;
  sequence: number;
  owner?: string | null;
  status: DecisionExecutionStepStatus;
  requiredBeforeExecution: boolean;
}

export interface DecisionExecutionPlan {
  decisionId: string;
  title: string;
  priority: EnterpriseDecisionPriority;
  accountableOwner?: string | null;
  steps: DecisionExecutionStep[];
  blocked: boolean;
  blockingReasons: string[];
  nextAction: string;
}

export interface DecisionExecutionPlannerInput {
  recommendation: EnterpriseDecisionRecommendation;
  risks: EnterpriseDecisionRisk[];
  approver?: string | null;
  executionOwner?: string | null;
}

export function buildDecisionExecutionPlan(
  input: DecisionExecutionPlannerInput,
): DecisionExecutionPlan {
  const criticalRisksWithoutMitigation = input.risks.filter(
    (risk) =>
      risk.severity === "critical" &&
      !risk.mitigation,
  );

  const blocked = criticalRisksWithoutMitigation.length > 0;

  const steps: DecisionExecutionStep[] = [
    {
      id: `${input.recommendation.decisionId}-validation`,
      title: "Validate recommendation",
      description:
        "Confirm that the supporting evidence, expected value, assumptions, and risk exposure remain valid.",
      sequence: 1,
      owner: input.approver ?? null,
      status: "ready",
      requiredBeforeExecution: true,
    },
    {
      id: `${input.recommendation.decisionId}-risk`,
      title: "Resolve critical risks",
      description:
        "Define and approve mitigation actions for all critical decision risks.",
      sequence: 2,
      owner:
        input.executionOwner ??
        input.recommendation.recommendedOwner ??
        null,
      status: blocked ? "blocked" : "ready",
      requiredBeforeExecution: true,
    },
    {
      id: `${input.recommendation.decisionId}-approval`,
      title: "Secure executive approval",
      description:
        "Record the decision approval, accountable owner, execution boundaries, and expected outcome.",
      sequence: 3,
      owner: input.approver ?? null,
      status: blocked ? "pending" : "ready",
      requiredBeforeExecution: true,
    },
    {
      id: `${input.recommendation.decisionId}-execution`,
      title: "Launch execution",
      description:
        "Convert the approved decision into an accountable enterprise execution initiative.",
      sequence: 4,
      owner:
        input.executionOwner ??
        input.recommendation.recommendedOwner ??
        null,
      status: "pending",
      requiredBeforeExecution: false,
    },
    {
      id: `${input.recommendation.decisionId}-measurement`,
      title: "Measure decision outcome",
      description:
        "Track delivery progress, realized value, risk movement, and decision effectiveness.",
      sequence: 5,
      owner:
        input.executionOwner ??
        input.recommendation.recommendedOwner ??
        null,
      status: "pending",
      requiredBeforeExecution: false,
    },
  ];

  return {
    decisionId: input.recommendation.decisionId,
    title: `Execution Plan: ${input.recommendation.title}`,
    priority: input.recommendation.priority,
    accountableOwner:
      input.executionOwner ??
      input.recommendation.recommendedOwner ??
      null,
    steps,
    blocked,
    blockingReasons: criticalRisksWithoutMitigation.map(
      (risk) => `${risk.title}: ${risk.description}`,
    ),
    nextAction: blocked
      ? "Assign mitigation owners and resolve all unmitigated critical risks before approval."
      : input.recommendation.recommendedNextAction,
  };
}
