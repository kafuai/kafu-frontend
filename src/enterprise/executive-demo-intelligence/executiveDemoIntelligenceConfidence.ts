import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceInput,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceConfidenceResult {
  confidence: ExecutiveDemoIntelligenceConfidence;
  score: number;
  reasons: string[];
}

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateExecutiveDemoIntelligenceConfidence(
  input: ExecutiveDemoIntelligenceInput,
): ExecutiveDemoIntelligenceConfidenceResult {
  let score = 25;
  const reasons: string[] = [];

  const discoveryAnswersCount =
    input.context.discoveryAnswersCount ?? 0;

  if (discoveryAnswersCount >= 10) {
    score += 25;
    reasons.push("Discovery evidence is comprehensive.");
  } else if (discoveryAnswersCount >= 5) {
    score += 15;
    reasons.push("Discovery evidence is sufficient.");
  } else {
    reasons.push("Discovery evidence is limited.");
  }

  const signalsCount = input.signals?.length ?? 0;

  if (signalsCount >= 4) {
    score += 20;
    reasons.push("Multiple intelligence signals support the analysis.");
  } else if (signalsCount >= 1) {
    score += 10;
    reasons.push("At least one intelligence signal is available.");
  } else {
    reasons.push("No intelligence signals are available.");
  }

  const knowledgeCount = input.knowledge?.length ?? 0;

  if (knowledgeCount >= 3) {
    score += 15;
    reasons.push("Relevant organizational knowledge is available.");
  } else if (knowledgeCount >= 1) {
    score += 8;
    reasons.push("Basic organizational knowledge is available.");
  } else {
    reasons.push("Organizational knowledge is limited.");
  }

  const objectivesCount = input.objectives?.length ?? 0;

  if (objectivesCount >= 3) {
    score += 10;
    reasons.push("Executive objectives are clearly defined.");
  } else if (objectivesCount >= 1) {
    score += 5;
    reasons.push("At least one executive objective is defined.");
  }

  if (
    input.context.readinessScore !== undefined &&
    input.context.corporateBrainScore !== undefined
  ) {
    score += 5;
    reasons.push("Multiple enterprise scores support the analysis.");
  }

  const normalizedScore = clampScore(score);

  const confidence: ExecutiveDemoIntelligenceConfidence =
    normalizedScore >= 75
      ? "high"
      : normalizedScore >= 50
        ? "medium"
        : "low";

  return {
    confidence,
    score: normalizedScore,
    reasons,
  };
}
