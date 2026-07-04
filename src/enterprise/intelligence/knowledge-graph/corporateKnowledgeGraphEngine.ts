import { KnowledgeGraphService } from "./knowledgeGraphService";
import { KnowledgeNodeFactory } from "./knowledgeNodeFactory";
import { KnowledgeRelationFactory } from "./knowledgeRelationFactory";
import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledgeGraphTypes";

export class CorporateKnowledgeGraphEngine {
  constructor(
    private readonly service = new KnowledgeGraphService(),
    private readonly nodeFactory = new KnowledgeNodeFactory(),
    private readonly relationFactory = new KnowledgeRelationFactory(),
  ) {}

  createCorporateGraph(): CorporateKnowledgeGraph {
    return this.service.createGraph();
  }

  addKnowledgeNode(
    input: Parameters<KnowledgeNodeFactory["createNode"]>[0],
  ): CorporateKnowledgeGraph {
    const node: KnowledgeNode = this.nodeFactory.createNode(input);
    return this.service.addNode(node);
  }

  addKnowledgeRelation(
    input: Parameters<KnowledgeRelationFactory["createRelation"]>[0],
  ): CorporateKnowledgeGraph {
    const relation: KnowledgeRelation =
      this.relationFactory.createRelation(input);

    return this.service.addRelation(relation);
  }

  getCorporateGraph(): CorporateKnowledgeGraph {
    return this.service.getGraph();
  }

  resetCorporateGraph(): void {
    this.service.resetGraph();
  }
}