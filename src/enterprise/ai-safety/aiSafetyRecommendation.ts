import {
  AISafetyDecision,
  AISafetyRiskLevel,
  AISafetyStatus,
} from "./aiSafetyTypes";

export enum AISafetyRecommendationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface AISafetyRecommendation {
  id: string;
  requestId: string;
  priority: AISafetyRecommendationPriority;
  title: string;
  description: string;
  createdAt: Date;
}

export function generateAISafetyRecommendations(
  decision: AISafetyDecision,
  requestId: string,
): AISafetyRecommendation[] {
  if (decision.status === AISafetyStatus.SAFE) {
    return [];
  }

  const priority =
    decision.riskLevel === AISafetyRiskLevel.CRITICAL
      ? AISafetyRecommendationPriority.URGENT
      : decision.riskLevel === AISafetyRiskLevel.HIGH
        ? AISafetyRecommendationPriority.HIGH
        : AISafetyRecommendationPriority.MEDIUM;

  return [
    {
      id: `${requestId}-ai-safety-review`,
      requestId,
      priority,
      title: "Review AI safety decision",
      description:
        "Review detected AI safety signals, validate the decision, and apply mitigation before allowing repeated execution.",
      createdAt: new Date(),
    },
    {
      id: `${requestId}-ai-safety-policy-tuning`,
      requestId,
      priority,
      title: "Tune AI safety policy",
      description:
        "Adjust safety thresholds, detection rules, or approved use cases based on the detected risk pattern.",
      createdAt: new Date(),
    },
  ];
}