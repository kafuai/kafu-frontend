import { EnterpriseContext } from "./contextTypes";

export interface RankedContext {
  context: EnterpriseContext;
  score: number;
}

export function rankContexts(
  contexts: EnterpriseContext[],
  priorities: Record<string, number>,
): RankedContext[] {
  return [...contexts]
    .map((context) => ({
      context,
      score: priorities[context.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);
}