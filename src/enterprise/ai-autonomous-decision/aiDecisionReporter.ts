import { AIDecisionContext } from "./aiDecisionContext";
import { AIDecisionSelection } from "./aiDecisionSelector";
import { AIDecisionValidationResult } from "./aiDecisionValidation";

export interface AIDecisionReport {
  id: string;
  organizationId: string;
  objective: string;
  selectedOptionTitle?: string;
  selectedOptionId?: string;
  totalOptions: number;
  isValid: boolean;
  issuesCount: number;
  generatedAt: string;
}

export function createAIDecisionReport(
  context: AIDecisionContext,
  selection: AIDecisionSelection,
  validation: AIDecisionValidationResult,
): AIDecisionReport {
  return {
    id: `decision-report-${context.id}`,
    organizationId: context.organizationId,
    objective: context.objective,
    selectedOptionTitle: selection.selectedOption?.title,
    selectedOptionId: selection.selectedOption?.id,
    totalOptions: context.options.length,
    isValid: validation.isValid,
    issuesCount: validation.issues.length,
    generatedAt: new Date().toISOString(),
  };
}