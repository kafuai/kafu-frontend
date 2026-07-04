import { AITrustLevel } from "./aiTrustTypes";
import { AITrustProfile } from "./aiTrustProfile";
import { AITrustDecision } from "./aiTrustDecision";

export interface AITrustReport {
  id: string;
  organizationId: string;
  profileId: string;
  modelId: string;
  trustScore: number;
  trustLevel: AITrustLevel;
  decisionOutcome: AITrustDecision["outcome"];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  generatedAt: Date;
}

export function generateAITrustReport(
  id: string,
  profile: AITrustProfile,
  decision: AITrustDecision,
): AITrustReport {
  return {
    id,
    organizationId: profile.context.organizationId,
    profileId: profile.id,
    modelId: profile.context.modelId,
    trustScore: profile.trustScore.score,
    trustLevel: profile.trustScore.level,
    decisionOutcome: decision.outcome,
    strengths: profile.strengths,
    weaknesses: profile.weaknesses,
    recommendations: profile.recommendations,
    generatedAt: new Date(),
  };
}