import { KnowledgeExtractionEngine } from "./knowledgeExtractionEngine";
import { KnowledgeExtractionMapper } from "./knowledgeExtractionMapper";
import { KnowledgeGraphService } from "./knowledgeGraphService";
import {
  KnowledgeExtractionSource,
} from "./knowledgeExtractionTypes";
import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";

export class KnowledgeGraphBuilder {
  constructor(
    private readonly extractionEngine = new KnowledgeExtractionEngine(),
    private readonly mapper = new KnowledgeExtractionMapper(),
    private readonly service = new KnowledgeGraphService(),
  ) {}

  buildFromSource(source: KnowledgeExtractionSource): CorporateKnowledgeGraph {
    this.service.createGraph();

    const result = this.extractionEngine.extract(source);
    const nodes = this.mapper.mapNodes(result);

    const entityToNodeId = nodes.reduce<Record<string, string>>(
      (acc, node) => {
        const extractedEntityId = node.metadata?.extractedEntityId;

        if (typeof extractedEntityId === "string") {
          acc[extractedEntityId] = node.id;
        }

        return acc;
      },
      {},
    );

    nodes.forEach((node) => {
      this.service.addNode(node);
    });

    const relations = this.mapper.mapRelations(result, entityToNodeId);

    relations.forEach((relation) => {
      this.service.addRelation(relation);
    });

    return this.service.getGraph();
  }
}