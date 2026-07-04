import { AIDecisionOption } from "./aiDecisionOption";
import { AIDecisionScorecard } from "./aiDecisionScorecard";
import { AIDecisionConfidenceAssessment } from "./aiDecisionConfidence";
import { AIDecisionRiskAssessment } from "./aiDecisionRiskAssessment";

export interface AIDecisionSelection {
  selectedOption?: AIDecisionOption;
  rejectedOptions: AIDecisionOption[];
  deferredOptions: AIDecisionOption[];
  reason: string;
  selectedAt: Date;
}

export interface SelectAIDecisionInput {
  options: AIDecisionOption[];
  scorecards: AIDecisionScorecard[];
  confidenceAssessments: AIDecisionConfidenceAssessment[];
  riskAssessments: AIDecisionRiskAssessment[];
  minimumScore?: number;
  minimumConfidence?: number;
  allowHighRisk?: boolean;
}

export function selectAIDecisionOption(
  input: SelectAIDecisionInput,
): AIDecisionSelection {
  const minimumScore = input.minimumScore ?? 0.6;
  const minimumConfidence = input.minimumConfidence ?? 0.55;

  const eligibleOptions = input.options.filter((option) => {
    const scorecard = input.scorecards.find((item) => item.optionId === option.id);
    const confidence = input.confidenceAssessments.find(
      (item) => item.optionId === option.id,
    );
    const risk = input.riskAssessments.find((item) => item.optionId === option.id);

    if (!scorecard || !confidence || !risk) {
      return false;
    }

    if (risk.blockers.length > 0) {
      return false;
    }

    if (!input.allowHighRisk && risk.riskLevel === "high") {
      return false;
    }

    return (
      scorecard.totalScore >= minimumScore &&
      confidence.confidenceScore >= minimumConfidence
    );
  });

  const selectedOption = eligibleOptions.sort((left, right) => {
    const leftScore =
      input.scorecards.find((item) => item.optionId === left.id)?.totalScore ?? 0;
    const rightScore =
      input.scorecards.find((item) => item.optionId === right.id)?.totalScore ?? 0;

    return rightScore - leftScore;
  })[0];

  return {
    selectedOption: selectedOption
      ? {
          ...selectedOption,
          status: "selected",
        }
      : undefined,
    rejectedOptions: input.options
      .filter((option) => option.id !== selectedOption?.id)
      .map((option) => ({
        ...option,
        status: option.status === "blocked" ? "blocked" : "rejected",
      })),
    deferredOptions: [],
    reason: selectedOption
      ? `Selected option "${selectedOption.title}" based on score, confidence, and risk gates.`
      : "No option met the minimum decision selection gates.",
    selectedAt: new Date(),
  };
}