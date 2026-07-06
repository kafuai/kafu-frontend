import { AIEnterpriseLearningProfile } from "./aiEnterpriseLearningProfile";
import { AIEnterpriseLearningReadinessResult } from "./aiEnterpriseLearningReadiness";

export interface AIEnterpriseLearningSummary {
  organizationId: string;
  headline: string;
  profile: AIEnterpriseLearningProfile;
  readiness: AIEnterpriseLearningReadinessResult;
  recommendedNextSteps: string[];
  generatedAt: Date;
}

export function summarizeAIEnterpriseLearning(input: {
  profile: AIEnterpriseLearningProfile;
  readiness: AIEnterpriseLearningReadinessResult;
}): AIEnterpriseLearningSummary {
  return {
    organizationId: input.profile.organizationId,
    headline: input.readiness.ready
      ? "Enterprise learning engine is ready for continuous improvement."
      : "Enterprise learning engine needs more learning evidence before full activation.",
    profile: input.profile,
    readiness: input.readiness,
    recommendedNextSteps: input.readiness.ready
      ? ["Enable continuous learning loop", "Monitor insight quality"]
      : input.readiness.reasons,
    generatedAt: new Date(),
  };
}