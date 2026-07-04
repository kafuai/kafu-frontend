import { EnterpriseContextItem } from "./contextTypes";

export type ExecutiveDecisionContextInput = {
  decisionId: string;
  title: string;
  rationale: string;
  confidence?: number;
  tags?: string[];
};

export function mapExecutiveDecisionToContext(
  decision: ExecutiveDecisionContextInput,
): EnterpriseContextItem {
  return {
    id: decision.decisionId,
    source: "executive_decision",
    title: decision.title,
    summary: decision.rationale,
    confidence: decision.confidence ?? 0.87,
    tags: decision.tags ?? [],
  };
}