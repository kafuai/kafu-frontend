export type KnowledgeGraphInsightType =
  | "missing_connection"
  | "dependency_risk"
  | "governance_gap"
  | "knowledge_overlap"
  | "organizational_signal";

export interface KnowledgeGraphInsight {
  readonly id: string;
  readonly type: KnowledgeGraphInsightType;
  readonly title: string;
  readonly description: string;
  readonly relatedNodeIds: readonly string[];
  readonly relatedRelationIds: readonly string[];
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly createdAt: string;
}

export function createKnowledgeGraphInsight(
  insight: KnowledgeGraphInsight,
): KnowledgeGraphInsight {
  return {
    ...insight,
    relatedNodeIds: [...insight.relatedNodeIds],
    relatedRelationIds: [...insight.relatedRelationIds],
  };
}