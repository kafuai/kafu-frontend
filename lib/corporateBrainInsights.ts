import type { CorporateBrain } from "@/types/corporateBrainModel";
import { generateCorporateBrainSummary } from "@/lib/corporateBrainSummary";
import { runDecisionEngine } from "@/lib/decisionEngine";
import { runStrategicThinking } from "@/lib/strategicThinking";

export type CorporateBrainInsights = {
  summary: string;
  decision: ReturnType<typeof runDecisionEngine>;
  strategy: ReturnType<typeof runStrategicThinking>;
  generatedAt: string;
  intelligenceScore: number;
  confidenceScore: number;
};

export function generateCorporateBrainInsights(
  brain: CorporateBrain,
): CorporateBrainInsights {
  return {
    summary: generateCorporateBrainSummary(brain),

    decision: runDecisionEngine(brain),

    strategy: runStrategicThinking(brain),

    intelligenceScore: brain.intelligenceScore,

    confidenceScore: brain.confidenceScore,

    generatedAt: new Date().toISOString(),
  };
}