import { AIDecisionOutcomeResolution } from "./aiDecisionOutcome";
import { AIDecisionSelection } from "./aiDecisionSelection";

export interface AIDecisionRecommendation {
  id: string;
  selectedOptionId?: string;
  title: string;
  summary: string;
  outcome: AIDecisionOutcomeResolution;
  nextActions: string[];
  createdAt: Date;
}

export interface CreateAIDecisionRecommendationInput {
  id: string;
  selection: AIDecisionSelection;
  outcome: AIDecisionOutcomeResolution;
}

export function createAIDecisionRecommendation(
  input: CreateAIDecisionRecommendationInput,
): AIDecisionRecommendation {
  const selectedOption = input.selection.selectedOption;

  return {
    id: input.id,
    selectedOptionId: selectedOption?.id,
    title: selectedOption
      ? `Decision recommendation: ${selectedOption.title}`
      : "Decision recommendation requires more data",
    summary: selectedOption
      ? input.selection.reason
      : "No option met decision gates. Additional evidence is required.",
    outcome: input.outcome,
    nextActions:
      input.outcome.outcome === "approve"
        ? ["Prepare decision for execution."]
        : input.outcome.outcome === "escalate"
          ? ["Route decision to human approval workflow."]
          : input.outcome.outcome === "defer"
            ? ["Collect missing confidence signals and reevaluate."]
            : input.outcome.outcome === "reject"
              ? ["Document rejection rationale and close decision cycle."]
              : ["Request additional data before continuing."],
    createdAt: new Date(),
  };
}