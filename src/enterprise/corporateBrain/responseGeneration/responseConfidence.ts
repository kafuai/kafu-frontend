export interface ResponseConfidence {
  overall: number;
  reasoning: number;
  retrieval: number;
  context: number;
}

export function calculateResponseConfidence(
  confidence: ResponseConfidence,
): number {
  const score =
    (confidence.overall +
      confidence.reasoning +
      confidence.retrieval +
      confidence.context) /
    4;

  return Number(score.toFixed(2));
}