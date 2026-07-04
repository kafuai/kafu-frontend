import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledgeGraphTypes";

export class KnowledgeGraphRepository {
  private graph: CorporateKnowledgeGraph = {
    nodes: [],
    relations: [],
    generatedAt: new Date().toISOString(),
  };

  getGraph(): CorporateKnowledgeGraph {
    return this.graph;
  }

  saveGraph(graph: CorporateKnowledgeGraph): CorporateKnowledgeGraph {
    this.graph = {
      ...graph,
      generatedAt: new Date().toISOString(),
    };

    return this.graph;
  }

  findNodeById(nodeId: string): KnowledgeNode | undefined {
    return this.graph.nodes.find((node) => node.id === nodeId);
  }

  findRelationsByNodeId(nodeId: string): KnowledgeRelation[] {
    return this.graph.relations.filter(
      (relation) =>
        relation.sourceNodeId === nodeId || relation.targetNodeId === nodeId,
    );
  }

  clear(): void {
    this.graph = {
      nodes: [],
      relations: [],
      generatedAt: new Date().toISOString(),
    };
  }
}