import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
} from "./knowledgeGraphTypes";

export class KnowledgeMergeEngine {
  mergeGraphs(
    baseGraph: CorporateKnowledgeGraph,
    incomingGraph: CorporateKnowledgeGraph,
  ): CorporateKnowledgeGraph {
    const nodesByKey = new Map<string, KnowledgeNode>();

    [...baseGraph.nodes, ...incomingGraph.nodes].forEach((node) => {
      const key = this.createNodeKey(node);

      if (!nodesByKey.has(key)) {
        nodesByKey.set(key, node);
      }
    });

    return {
      nodes: Array.from(nodesByKey.values()),
      relations: [...baseGraph.relations, ...incomingGraph.relations],
      generatedAt: new Date().toISOString(),
    };
  }

  private createNodeKey(node: KnowledgeNode): string {
    return `${node.type}:${node.title.trim().toLowerCase()}`;
  }
}