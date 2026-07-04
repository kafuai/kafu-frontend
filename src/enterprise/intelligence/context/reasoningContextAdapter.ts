import { EnterpriseContextItem } from "./contextTypes";

export type ExecutiveReasoningContextInput = {
  reasoningId: string;
  title: string;
  insight: string;
  confidence?: number;
  tags?: string[];
};

export function mapExecutiveReasoningToContext(
  reasoning: ExecutiveReasoningContextInput,
): EnterpriseContextItem {
  return {
    id: reasoning.reasoningId,
    source: "executive_reasoning",
    title: reasoning.title,
    summary: reasoning.insight,
    confidence: reasoning.confidence ?? 0.88,
    tags: reasoning.tags ?? [],
  };
}