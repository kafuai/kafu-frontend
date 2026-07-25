import type {
  NextActionPriority,
  NextActionStatus,
  NextActionType,
} from "../salesIntelligenceConstants";

import type {
  CreateNextActionInput,
  SalesPipelineNextAction,
} from "../salesIntelligenceTypes";

export type OpportunityNextActionIdentity = {
  pipelineId: string;
  companyId: string;
};

export type CreateOpportunityNextActionInput =
  CreateNextActionInput & {
    companyId?: string;
  };

export type UpdateOpportunityNextActionInput = {
  actionId: string;
  pipelineId: string;
  title?: string;
  description?: string | null;
  dueAt?: string;
  ownerId?: string | null;
  ownerName?: string | null;
  priority?: NextActionPriority;
  status?: NextActionStatus;
  isPrimary?: boolean;
};

export type TransitionOpportunityNextActionInput = {
  actionId: string;
  pipelineId: string;
  status: NextActionStatus;
  reason?: string | null;
};

export type CompleteOpportunityNextActionInput = {
  actionId: string;
  pipelineId: string;
  outcome?: string | null;
};

export type CancelOpportunityNextActionInput = {
  actionId: string;
  pipelineId: string;
  reason?: string | null;
};

export type OpportunityNextActionQuery = {
  pipelineId: string;
  statuses?: NextActionStatus[];
  actionTypes?: NextActionType[];
  includeCompleted?: boolean;
};

export type OpportunityNextActionSnapshot = {
  pipelineId: string;
  companyId: string;
  generatedAt: string;
  primaryAction: SalesPipelineNextAction | null;
  actions: SalesPipelineNextAction[];
  openCount: number;
  overdueCount: number;
};

export type NextActionPriorityEvaluation = {
  priority: NextActionPriority;
  overdue: boolean;
  dueWithinHours: number | null;
};

export type OpportunityNextActionMutationResult = {
  action: SalesPipelineNextAction;
  previousPrimaryActionId: string | null;
};
