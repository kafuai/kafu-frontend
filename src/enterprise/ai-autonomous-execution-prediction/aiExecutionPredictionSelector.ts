import {
  AIExecutionPredictionScenario,
  hasBlockingAIExecutionPredictionConstraint,
} from "./aiExecutionPredictionScenario";
import { AIExecutionPredictionScore } from "./aiExecutionPredictionTypes";
import { scoreAIExecutionPredictionScenario } from "./aiExecutionPredictionScoring";

export interface AIExecutionPredictionSelection {
  selectedScenario?: AIExecutionPredictionScenario;
  selectedScore?: AIExecutionPredictionScore;
  eligibleScenarios: AIExecutionPredictionScenario[];
  rejectedScenarios: AIExecutionPredictionScenario[];
  rationale: string;
}

export function selectBestAIExecutionPredictionScenario(
  scenarios: AIExecutionPredictionScenario[],
): AIExecutionPredictionSelection {
  const eligibleScenarios = scenarios.filter(
    (scenario) => !hasBlockingAIExecutionPredictionConstraint(scenario),
  );

  const rejectedScenarios = scenarios.filter((scenario) =>
    hasBlockingAIExecutionPredictionConstraint(scenario),
  );

  if (eligibleScenarios.length === 0) {
    return {
      eligibleScenarios,
      rejectedScenarios,
      rationale: "No eligible prediction scenario available.",
    };
  }

  const ranked = eligibleScenarios
    .map((scenario) => ({
      scenario,
      score: scoreAIExecutionPredictionScenario(scenario),
    }))
    .sort((a, b) => b.score.total - a.score.total);

  const best = ranked[0];

  return {
    selectedScenario: {
      ...best.scenario,
      status: "selected",
    },
    selectedScore: best.score,
    eligibleScenarios: eligibleScenarios.map((scenario) => ({
      ...scenario,
      status: scenario.id === best.scenario.id ? "selected" : "eligible",
    })),
    rejectedScenarios: rejectedScenarios.map((scenario) => ({
      ...scenario,
      status: "rejected",
    })),
    rationale: `Selected prediction scenario "${best.scenario.title}".`,
  };
}