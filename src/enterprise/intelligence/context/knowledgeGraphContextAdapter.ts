import { EnterpriseContextItem } from "./contextTypes";

export type KnowledgeGraphContextInput = {
  nodeId: string;
  label: string;
  description: string;
  confidence?: number;
  tags?: string[];
};

export function mapKnowledgeGraphNodeToContext(
  node: KnowledgeGraphContextInput,
): EnterpriseContextItem {
  return {
    id: node.nodeId,
    source: "knowledge_graph",
    title: node.label,
    summary: node.description,
    confidence: node.confidence ?? 0.9,
    tags: node.tags ?? [],
  };
}