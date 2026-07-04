import { AITrustContext } from "./aiTrustTypes";
import { AITrustSignal } from "./aiTrustSignal";
import { AITrustScore, calculateAITrustScore } from "./aiTrustScore";

export interface AITrustProfile {
  id: string;
  context: AITrustContext;
  signals: AITrustSignal[];
  trustScore: AITrustScore;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function createAITrustProfile(
  id: string,
  context: AITrustContext,
  signals: AITrustSignal[],
): AITrustProfile {
  return {
    id,
    context,
    signals,
    trustScore: calculateAITrustScore(signals),
    strengths: [],
    weaknesses: [],
    recommendations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}