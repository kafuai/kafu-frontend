import { AITransparencyAssessment } from "./aiTransparencyAssessment";

export type AITransparencyReadinessLevel =
  | "not_ready"
  | "partially_ready"
  | "ready"
  | "excellent";

export interface AITransparencyReadiness {
  transparencyRecordId: string;
  level: AITransparencyReadinessLevel;
  score: number;
  recommendations: string[];
  evaluatedAt: Date;
}

export function evaluateAITransparencyReadiness(
  assessment: AITransparencyAssessment,
): AITransparencyReadiness {
  const recommendations: string[] = [];

  if (assessment.score < 70) {
    recommendations.push(
      "Complete missing transparency evidence before disclosure.",
    );
  }

  if (assessment.findings.length > 0) {
    recommendations.push(
      "Review transparency findings and resolve open gaps.",
    );
  }

  let level: AITransparencyReadinessLevel = "not_ready";

  if (assessment.score >= 90) {
    level = "excellent";
  } else if (assessment.score >= 70) {
    level = "ready";
  } else if (assessment.score >= 40) {
    level = "partially_ready";
  }

  return {
    transparencyRecordId: assessment.transparencyRecordId,
    level,
    score: assessment.score,
    recommendations,
    evaluatedAt: new Date(),
  };
}