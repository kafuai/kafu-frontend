import { AIDecisionContext } from "./aiDecisionContext";
import { AIDecisionSelection } from "./aiDecisionSelection";
import { AIDecisionOutcomeResolution } from "./aiDecisionOutcome";

export interface AIDecisionAuditRecord {
  id: string;
  contextId: string;
  organizationId: string;
  objective: string;
  selectedOptionId?: string;
  outcome: string;
  reason: string;
  createdBy: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CreateAIDecisionAuditRecordInput {
  id: string;
  context: AIDecisionContext;
  selection: AIDecisionSelection;
  outcome: AIDecisionOutcomeResolution;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export function createAIDecisionAuditRecord(
  input: CreateAIDecisionAuditRecordInput,
): AIDecisionAuditRecord {
  return {
    id: input.id,
    contextId: input.context.id,
    organizationId: input.context.organizationId,
    objective: input.context.objective,
    selectedOptionId: input.selection.selectedOption?.id,
    outcome: input.outcome.outcome,
    reason: input.outcome.reason,
    createdBy: input.createdBy,
    createdAt: new Date(),
    metadata: input.metadata,
  };
}