import { KnowledgeGraphCore } from "./knowledgeGraphCore";
import { KnowledgeGraphRepository } from "./knowledgeGraphRepository";
import { KnowledgeGraphValidator } from "./knowledgeGraphValidator";
import {
  CorporateKnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledgeGraphTypes";

export class KnowledgeGraphService {
  constructor(
    private readonly core = new KnowledgeGraphCore(),
    private readonly repository = new KnowledgeGraphRepository(),
    private readonly validator = new KnowledgeGraphValidator(),
  ) {}

  createGraph(): CorporateKnowledgeGraph {
    const graph = this.core.createEmptyGraph();
    return this.repository.saveGraph(graph);
  }

  addNode(node: KnowledgeNode): CorporateKnowledgeGraph {
    const graph = this.repository.getGraph();
    const nextGraph = this.core.addNode(graph, node);

    const validation = this.validator.validate(nextGraph);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(" "));
    }

    return this.repository.saveGraph(nextGraph);
  }

  addRelation(relation: KnowledgeRelation): CorporateKnowledgeGraph {
    const graph = this.repository.getGraph();
    const nextGraph = this.core.addRelation(graph, relation);

    const validation = this.validator.validate(nextGraph);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(" "));
    }

    return this.repository.saveGraph(nextGraph);
  }

  getGraph(): CorporateKnowledgeGraph {
    return this.repository.getGraph();
  }

  resetGraph(): void {
    this.repository.clear();
  }
}