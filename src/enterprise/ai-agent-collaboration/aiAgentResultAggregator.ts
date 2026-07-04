import {
  AIAgentMergedResult,
  AIAgentResult,
  mergeAIAgentResults,
} from "./aiAgentResultMerge";

export interface AIAgentResultAggregation {
  id: string;
  teamId: string;
  mergedResult: AIAgentMergedResult;
  confidenceScore: number;
  createdAt: Date;
}

export function aggregateAIAgentResults(
  id: string,
  teamId: string,
  results: AIAgentResult[],
): AIAgentResultAggregation {
  if (!id.trim()) throw new Error("Result aggregation id is required");
  if (!teamId.trim()) throw new Error("Result aggregation team id is required");

  const mergedResult = mergeAIAgentResults(results);
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);

  return {
    id,
    teamId,
    mergedResult,
    confidenceScore: totalScore / results.length,
    createdAt: new Date(),
  };
}