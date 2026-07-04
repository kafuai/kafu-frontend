import { AIAccountabilitySeverity } from "./aiAccountabilityTypes";

export type AIAccountabilityRemediationStatus =
  | "open"
  | "in_progress"
  | "blocked"
  | "completed"
  | "verified"
  | "cancelled";

export interface AIAccountabilityRemediationAction {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  dueAt?: Date;
  completedAt?: Date;
  status: AIAccountabilityRemediationStatus;
}

export interface AIAccountabilityRemediationPlan {
  id: string;
  organizationId: string;
  decisionId: string;
  impactId?: string;
  severity: AIAccountabilitySeverity;
  status: AIAccountabilityRemediationStatus;
  rootCause: string;
  correctiveActions: AIAccountabilityRemediationAction[];
  preventiveActions: AIAccountabilityRemediationAction[];
  verificationOwnerId?: string;
  verifiedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAccountabilityRemediationPlanInput {
  id: string;
  organizationId: string;
  decisionId: string;
  impactId?: string;
  severity: AIAccountabilitySeverity;
  rootCause: string;
  correctiveActions?: AIAccountabilityRemediationAction[];
  preventiveActions?: AIAccountabilityRemediationAction[];
  verificationOwnerId?: string;
  createdBy: string;
}

export function createAIAccountabilityRemediationPlan(
  input: CreateAIAccountabilityRemediationPlanInput,
  now: Date = new Date(),
): AIAccountabilityRemediationPlan {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    impactId: input.impactId,
    severity: input.severity,
    status: "open",
    rootCause: input.rootCause,
    correctiveActions: input.correctiveActions ?? [],
    preventiveActions: input.preventiveActions ?? [],
    verificationOwnerId: input.verificationOwnerId,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateRemediationPlanStatus(
  plan: AIAccountabilityRemediationPlan,
  status: AIAccountabilityRemediationStatus,
  now: Date = new Date(),
): AIAccountabilityRemediationPlan {
  return {
    ...plan,
    status,
    updatedAt: now,
  };
}

export function verifyRemediationPlan(
  plan: AIAccountabilityRemediationPlan,
  verificationOwnerId: string,
  now: Date = new Date(),
): AIAccountabilityRemediationPlan {
  return {
    ...plan,
    status: "verified",
    verificationOwnerId,
    verifiedAt: now,
    updatedAt: now,
  };
}

export function isRemediationOverdue(
  plan: AIAccountabilityRemediationPlan,
  at: Date = new Date(),
): boolean {
  const actions = [...plan.correctiveActions, ...plan.preventiveActions];

  return actions.some(
    (action) =>
      action.status !== "completed" &&
      action.status !== "verified" &&
      action.dueAt !== undefined &&
      action.dueAt.getTime() < at.getTime(),
  );
}

export function calculateRemediationCompletionRate(
  plan: AIAccountabilityRemediationPlan,
): number {
  const actions = [...plan.correctiveActions, ...plan.preventiveActions];

  if (actions.length === 0) {
    return 0;
  }

  const completed = actions.filter(
    (action) => action.status === "completed" || action.status === "verified",
  ).length;

  return completed / actions.length;
}