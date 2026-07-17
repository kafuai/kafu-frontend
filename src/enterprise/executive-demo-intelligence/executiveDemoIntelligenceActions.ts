import type {
  ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import type {
  ExecutiveDemoIntelligencePriority,
} from "./executiveDemoIntelligenceTypes";

export type ExecutiveDemoIntelligenceActionStatus =
  | "recommended"
  | "ready"
  | "blocked"
  | "completed";

export interface ExecutiveDemoIntelligenceAction {
  id: string;
  title: string;
  description: string;
  priority: ExecutiveDemoIntelligencePriority;
  status: ExecutiveDemoIntelligenceActionStatus;
  ownerRole: string;
  expectedOutcome: string;
  relatedDecisionId: string;
}

export function buildExecutiveDemoIntelligenceActions(
  decision: ExecutiveDemoIntelligenceDecision,
): ExecutiveDemoIntelligenceAction[] {
  const primaryAction: ExecutiveDemoIntelligenceAction = {
    id: `${decision.id}-primary-action`,
    title: "Initiate executive action",
    description: decision.recommendedAction,
    priority: decision.priority,
    status: "ready",
    ownerRole: resolveOwnerRole(decision.priority),
    expectedOutcome:
      "Convert executive intelligence into a measurable and accountable next step.",
    relatedDecisionId: decision.id,
  };

  const validationAction: ExecutiveDemoIntelligenceAction = {
    id: `${decision.id}-validation-action`,
    title: "Validate evidence and success criteria",
    description:
      "Confirm the supporting evidence, accountable owner and measurable success criteria before execution.",
    priority:
      decision.confidence === "low"
        ? "high"
        : decision.priority === "critical"
          ? "high"
          : "medium",
    status:
      decision.confidence === "low" ? "blocked" : "recommended",
    ownerRole: "Executive Sponsor",
    expectedOutcome:
      "Improved decision quality and stronger execution confidence.",
    relatedDecisionId: decision.id,
  };

  return [primaryAction, validationAction];
}

function resolveOwnerRole(
  priority: ExecutiveDemoIntelligencePriority,
): string {
  if (priority === "critical") {
    return "Executive Sponsor";
  }

  if (priority === "high") {
    return "Business Transformation Lead";
  }

  return "AI Program Owner";
}

export function rankExecutiveDemoIntelligenceActions(
  actions: ExecutiveDemoIntelligenceAction[],
): ExecutiveDemoIntelligenceAction[] {
  const priorityWeight: Record<
    ExecutiveDemoIntelligencePriority,
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const statusWeight: Record<
    ExecutiveDemoIntelligenceActionStatus,
    number
  > = {
    ready: 4,
    recommended: 3,
    blocked: 2,
    completed: 1,
  };

  return [...actions].sort((left, right) => {
    const priorityDifference =
      priorityWeight[right.priority] -
      priorityWeight[left.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return statusWeight[right.status] - statusWeight[left.status];
  });
}
