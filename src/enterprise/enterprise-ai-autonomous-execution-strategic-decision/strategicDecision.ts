import {
  StrategicDecisionCategory,
  StrategicDecisionConfidence,
  StrategicDecisionOwner,
  StrategicDecisionPriority,
  StrategicDecisionRisk,
  StrategicDecisionStakeholder,
  StrategicDecisionStatus,
  StrategicDecisionTarget,
  StrategicDecisionTimeHorizon,
} from "./strategicDecisionTypes";

export interface StrategicDecision {
  decisionId: string;
  organizationId: string;
  title: string;
  description: string;
  strategicObjective: string;
  category: StrategicDecisionCategory;
  priority: StrategicDecisionPriority;
  status: StrategicDecisionStatus;
  timeHorizon: StrategicDecisionTimeHorizon;
  confidence: StrategicDecisionConfidence;
  owner: StrategicDecisionOwner;
  stakeholders: StrategicDecisionStakeholder[];
  targets: StrategicDecisionTarget[];
  risks: StrategicDecisionRisk[];
  assumptions: string[];
  constraints: string[];
  dependencies: string[];
  alternatives: string[];
  expectedOutcome: string;
  rationale: string;
  estimatedValue?: number | null;
  estimatedCost?: number | null;
  currency?: string | null;
  approvalDeadline?: string | null;
  executionStartDate?: string | null;
  executionEndDate?: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  completedAt?: string | null;
}

export interface CreateStrategicDecisionInput {
  organizationId: string;
  title: string;
  description: string;
  strategicObjective: string;
  category: StrategicDecisionCategory;
  priority: StrategicDecisionPriority;
  timeHorizon: StrategicDecisionTimeHorizon;
  confidence: StrategicDecisionConfidence;
  owner: StrategicDecisionOwner;
  stakeholders?: StrategicDecisionStakeholder[];
  targets?: StrategicDecisionTarget[];
  risks?: StrategicDecisionRisk[];
  assumptions?: string[];
  constraints?: string[];
  dependencies?: string[];
  alternatives?: string[];
  expectedOutcome: string;
  rationale: string;
  estimatedValue?: number | null;
  estimatedCost?: number | null;
  currency?: string | null;
  approvalDeadline?: string | null;
  executionStartDate?: string | null;
  executionEndDate?: string | null;
}

export interface UpdateStrategicDecisionInput {
  title?: string;
  description?: string;
  strategicObjective?: string;
  category?: StrategicDecisionCategory;
  priority?: StrategicDecisionPriority;
  status?: StrategicDecisionStatus;
  timeHorizon?: StrategicDecisionTimeHorizon;
  confidence?: StrategicDecisionConfidence;
  owner?: StrategicDecisionOwner;
  stakeholders?: StrategicDecisionStakeholder[];
  targets?: StrategicDecisionTarget[];
  risks?: StrategicDecisionRisk[];
  assumptions?: string[];
  constraints?: string[];
  dependencies?: string[];
  alternatives?: string[];
  expectedOutcome?: string;
  rationale?: string;
  estimatedValue?: number | null;
  estimatedCost?: number | null;
  currency?: string | null;
  approvalDeadline?: string | null;
  executionStartDate?: string | null;
  executionEndDate?: string | null;
  approvedAt?: string | null;
  completedAt?: string | null;
}
