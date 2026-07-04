import {
  EnterpriseAIProcessHealthState,
  EnterpriseAIProcessPriority,
  EnterpriseAIProcessRiskLevel,
  EnterpriseAIProcessStatus,
} from "./process.enums";

export type EnterpriseAIProcessId = string;
export type EnterpriseAIWorkflowId = string;

export type EnterpriseAIProcessDependency = {
  id: string;
  processId: EnterpriseAIProcessId;
  required: boolean;
  description?: string;
};

export type EnterpriseAIProcessOwner = {
  ownerId: string;
  ownerName: string;
  team?: string;
};

export type EnterpriseAIProcessGovernance = {
  policyId?: string;
  complianceRequired: boolean;
  auditRequired: boolean;
  approvalRequired: boolean;
};

export type EnterpriseAIProcessMetrics = {
  completionRate: number;
  averageExecutionTimeMs: number;
  failureRate: number;
  blockedCount: number;
};

export type EnterpriseAIProcessHealth = {
  state: EnterpriseAIProcessHealthState;
  riskLevel: EnterpriseAIProcessRiskLevel;
  score: number;
  reasons: string[];
};

export type EnterpriseAIProcess = {
  id: EnterpriseAIProcessId;
  name: string;
  description: string;
  workflowIds: EnterpriseAIWorkflowId[];
  status: EnterpriseAIProcessStatus;
  priority: EnterpriseAIProcessPriority;
  owner: EnterpriseAIProcessOwner;
  dependencies: EnterpriseAIProcessDependency[];
  governance: EnterpriseAIProcessGovernance;
  metrics: EnterpriseAIProcessMetrics;
  health: EnterpriseAIProcessHealth;
  createdAt: string;
  updatedAt: string;
};