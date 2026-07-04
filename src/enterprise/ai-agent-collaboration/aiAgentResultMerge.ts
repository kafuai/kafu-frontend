export interface AIAgentResult<T = unknown> {
  agentId: string;
  score: number;
  result: T;
}

export interface AIAgentMergedResult<T = unknown> {
  winner: AIAgentResult<T>;
  results: AIAgentResult<T>[];
}

export function mergeAIAgentResults<T>(
  results: AIAgentResult<T>[],
): AIAgentMergedResult<T> {
  if (results.length === 0) {
    throw new Error("At least one result is required");
  }

  const winner = results.reduce((best, current) =>
    current.score > best.score ? current : best,
  );

  return {
    winner,
    results: [...results],
  };
}