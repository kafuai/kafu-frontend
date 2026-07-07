import { AIReasoningEvidence, calculateEvidenceWeight } from "./aiReasoningEvidence";
import { AIReasoningHypothesis } from "./aiReasoningHypothesis";
import { AIReasoningScore } from "./aiReasoningTypes";

export function scoreAIReasoningHypothesis(
  hypothesis: AIReasoningHypothesis,
  evidence: readonly AIReasoningEvidence[],
): AIReasoningScore {
  const supportingEvidence = evidence.filter((item) =>
    hypothesis.evidenceIds.includes(item.id),
  );

  const evidenceCoverage =
    hypothesis.evidenceIds.length === 0
      ? 0
      : supportingEvidence.length / hypothesis.evidenceIds.length;

  const averageEvidenceWeight =
    supportingEvidence.length === 0
      ? 0
      : supportingEvidence.reduce(
          (total, item) => total + calculateEvidenceWeight(item),
          0,
        ) / supportingEvidence.length;

  const risk = normalizeScore(hypothesis.risks.length / 5);

  const consistency = normalizeScore(
    averageEvidenceWeight * 0.7 + evidenceCoverage * 0.3,
  );

  const confidence = normalizeScore(
    averageEvidenceWeight * 0.5 +
      evidenceCoverage * 0.3 +
      consistency * 0.2 -
      risk * 0.2,
  );

  return {
    confidence: roundScore(confidence),
    consistency: roundScore(consistency),
    evidenceCoverage: roundScore(evidenceCoverage),
    risk: roundScore(risk),
  };
}

function normalizeScore(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}