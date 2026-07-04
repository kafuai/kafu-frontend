import {
  AITrustEvidence,
  AITrustSignalCategory,
  AITrustSignalStatus,
} from "./aiTrustTypes";

export interface AITrustSignal {
  id: string;
  category: AITrustSignalCategory;
  name: string;
  description: string;
  score: number;
  weight: number;
  status: AITrustSignalStatus;
  evidence: AITrustEvidence[];
  createdAt: Date;
  updatedAt: Date;
}

export function normalizeAITrustSignalScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, score));
}

export function calculateWeightedAITrustSignal(signal: AITrustSignal): number {
  return normalizeAITrustSignalScore(signal.score) * Math.max(0, signal.weight);
}