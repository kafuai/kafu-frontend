export interface AITokenUsageSegment {
  id: string;
  source: "system" | "user" | "context" | "memory" | "tool" | "output";
  tokenCount: number;
  reusable: boolean;
  redundant: boolean;
  importanceScore: number;
}

export interface AITokenOptimizationResult {
  organizationId: string;
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  savedPercent: number;
  removedSegments: AITokenUsageSegment[];
  retainedSegments: AITokenUsageSegment[];
  createdAt: Date;
}

export function optimizeAITokenUsage(
  organizationId: string,
  segments: AITokenUsageSegment[],
  targetReductionPercent = 20,
): AITokenOptimizationResult {
  const originalTokens = segments.reduce((sum, segment) => sum + segment.tokenCount, 0);
  const targetTokens = originalTokens * (1 - targetReductionPercent / 100);

  const retainedSegments: AITokenUsageSegment[] = [];
  const removableSegments = [...segments].sort(
    (a, b) => scoreRemovableTokenSegment(b) - scoreRemovableTokenSegment(a),
  );

  let optimizedTokens = originalTokens;
  const removedSegments: AITokenUsageSegment[] = [];

  for (const segment of removableSegments) {
    if (optimizedTokens <= targetTokens) break;

    if (segment.redundant || (segment.reusable && segment.importanceScore < 0.5)) {
      removedSegments.push(segment);
      optimizedTokens -= segment.tokenCount;
    }
  }

  const removedIds = new Set(removedSegments.map((segment) => segment.id));

  for (const segment of segments) {
    if (!removedIds.has(segment.id)) {
      retainedSegments.push(segment);
    }
  }

  const savedTokens = originalTokens - optimizedTokens;

  return {
    organizationId,
    originalTokens,
    optimizedTokens,
    savedTokens,
    savedPercent: originalTokens === 0 ? 0 : (savedTokens / originalTokens) * 100,
    removedSegments,
    retainedSegments,
    createdAt: new Date(),
  };
}

function scoreRemovableTokenSegment(segment: AITokenUsageSegment): number {
  const redundancyScore = segment.redundant ? 1 : 0;
  const reuseScore = segment.reusable ? 0.5 : 0;
  const lowImportanceScore = 1 - segment.importanceScore;

  return redundancyScore + reuseScore + lowImportanceScore;
}