import { KnowledgeGraphNode } from "./knowledgeGraphNode";
import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";

export interface KnowledgeGraphIntegrityIssue {
  readonly id: string;
  readonly relationId: string;
  readonly message: string;
  readonly severity: "low" | "medium" | "high" | "critical";
}

export function validateKnowledgeGraphIntegrity(
  nodes: readonly KnowledgeGraphNode[],
  relations: readonly KnowledgeGraphRelation[],
): readonly KnowledgeGraphIntegrityIssue[] {
  const nodeIds = new Set(nodes.map((node) => node.id));

  return relations
    .filter(
      (relation) =>
        !nodeIds.has(relation.fromNodeId) || !nodeIds.has(relation.toNodeId),
    )
    .map((relation) => ({
      id: `integrity-${relation.id}`,
      relationId: relation.id,
      message: "Relation references one or more missing nodes.",
      severity: "high",
    }));
}