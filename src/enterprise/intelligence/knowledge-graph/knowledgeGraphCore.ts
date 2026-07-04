import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledgeGraphTypes";

export class KnowledgeGraphCore {
  createEmptyGraph(): CorporateKnowledgeGraph {
    return {
      nodes: [],
      relations: [],
      generatedAt: new Date().toISOString(),
    };
  }

  addNode(
    graph: CorporateKnowledgeGraph,
    node: KnowledgeNode,
  ): CorporateKnowledgeGraph {
    return {
      ...graph,
      nodes: [...graph.nodes, node],
      generatedAt: new Date().toISOString(),
    };
  }

  addRelation(
    graph: CorporateKnowledgeGraph,
    relation: KnowledgeRelation,
  ): CorporateKnowledgeGraph {
    return {
      ...graph,
      relations: [...graph.relations, relation],
      generatedAt: new Date().toISOString(),
    };
  }
}