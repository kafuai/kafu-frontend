import { ComplianceMetadata, ComplianceOwner } from "./complianceTypes";

export type ComplianceRemediationStatus =
  | "planned"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

export interface ComplianceRemediationAction {
  id: string;
  title: string;
  description: string;
  owner: ComplianceOwner;
  dueDate: string;
  completedAt?: string;
  status: ComplianceRemediationStatus;
}

export interface ComplianceRemediationPlan {
  id: string;
  findingId: string;
  title: string;
  description: string;
  owner: ComplianceOwner;
  actions: ComplianceRemediationAction[];
  targetCompletionDate: string;
  status: ComplianceRemediationStatus;
  metadata: ComplianceMetadata;
}

export function createComplianceRemediationPlan(
  plan: ComplianceRemediationPlan,
): ComplianceRemediationPlan {
  if (!plan.id.trim()) {
    throw new Error("Compliance remediation plan id is required.");
  }

  if (!plan.findingId.trim()) {
    throw new Error("Compliance remediation plan findingId is required.");
  }

  if (!plan.title.trim()) {
    throw new Error("Compliance remediation plan title is required.");
  }

  return {
    ...plan,
    metadata: {
      ...plan.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function calculateRemediationProgress(
  plan: ComplianceRemediationPlan,
): number {
  if (plan.actions.length === 0) {
    return 0;
  }

  const completed = plan.actions.filter(
    (action) => action.status === "completed",
  ).length;

  return Math.round((completed / plan.actions.length) * 100);
}