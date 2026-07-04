export type EnterpriseRiskMitigationStatus =
  | "draft"
  | "approved"
  | "inProgress"
  | "completed"
  | "blocked";

export interface EnterpriseRiskMitigationAction {
  actionId: string;
  description: string;
  ownerId: string;
  dueDate?: string;
  completedAt?: string;
}

export interface EnterpriseRiskMitigationPlan {
  planId: string;
  riskId: string;
  strategy: "avoid" | "reduce" | "transfer" | "accept";
  status: EnterpriseRiskMitigationStatus;
  actions: EnterpriseRiskMitigationAction[];
  expectedResidualScore?: number;
  createdAt: string;
  updatedAt: string;
}