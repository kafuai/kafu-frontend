import { AIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationOpportunity";
import { scoreAIExecutionOptimizationOpportunity } from "./aiExecutionOptimizationScoring";

export function prioritizeAIExecutionOptimizationOpportunities(
  opportunities: AIExecutionOptimizationOpportunity[],
): AIExecutionOptimizationOpportunity[] {
  return [...opportunities].sort((a, b) => {
    const scoreA = scoreAIExecutionOptimizationOpportunity(a).overall;
    const scoreB = scoreAIExecutionOptimizationOpportunity(b).overall;

    return scoreB - scoreA;
  });
}