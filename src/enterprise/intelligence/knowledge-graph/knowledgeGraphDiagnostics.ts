import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";

export type KnowledgeGraphDiagnostics = {
  nodeCount: number;
  relationCount: number;
  orphanNodeCount: number;
  generatedAt: string;
};

export function getKnowledgeGraphDiagnostics(
  graph: CorporateKnowledgeGraph,
): KnowledgeGraphDiagnostics {
  const connectedNodeIds = new Set<string>();

  graph.relations.forEach((relation) => {
    connectedNodeIds.add(relation.sourceNodeId);
    connectedNodeIds.add(relation.targetNodeId);
  });

  return {
    nodeCount: graph.nodes.length,
    relationCount: graph.relations.length,
    orphanNodeCount: graph.nodes.filter((node) => !connectedNodeIds.has(node.id))
      .length,
    generatedAt: graph.generatedAt,
  };
}