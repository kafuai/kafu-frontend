import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
} from "./knowledgeGraphTypes";

export class KnowledgeEnrichmentEngine {
  enrich(graph: CorporateKnowledgeGraph): CorporateKnowledgeGraph {
    return {
      ...graph,
      nodes: graph.nodes.map((node) => this.enrichNode(node)),
      generatedAt: new Date().toISOString(),
    };
  }

  private enrichNode(node: KnowledgeNode): KnowledgeNode {
    return {
      ...node,
      metadata: {
        ...node.metadata,
        enriched: true,
        enrichedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };
  }
}