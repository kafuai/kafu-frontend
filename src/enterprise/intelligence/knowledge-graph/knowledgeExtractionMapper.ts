import { KnowledgeNodeFactory } from "./knowledgeNodeFactory";
import { KnowledgeRelationFactory } from "./knowledgeRelationFactory";
import {
  KnowledgeExtractionResult,
} from "./knowledgeExtractionTypes";
import {
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledgeGraphTypes";

export class KnowledgeExtractionMapper {
  constructor(
    private readonly nodeFactory = new KnowledgeNodeFactory(),
    private readonly relationFactory = new KnowledgeRelationFactory(),
  ) {}

  mapNodes(result: KnowledgeExtractionResult): KnowledgeNode[] {
    return result.entities.map((entity) =>
      this.nodeFactory.createNode({
        type: entity.nodeType,
        title: entity.title,
        description: entity.description,
        confidence: entity.confidence,
        metadata: {
          sourceId: entity.sourceId,
          extractedEntityId: entity.id,
        },
      }),
    );
  }

  mapRelations(
    result: KnowledgeExtractionResult,
    entityToNodeId: Record<string, string>,
  ): KnowledgeRelation[] {
    return result.relations.map((relation) =>
      this.relationFactory.createRelation({
        sourceNodeId: entityToNodeId[relation.sourceEntityId],
        targetNodeId: entityToNodeId[relation.targetEntityId],
        type: relation.relationType,
        confidence: relation.confidence,
        description: relation.description,
        metadata: {
          sourceId: relation.sourceId,
          extractedRelationId: relation.id,
        },
      }),
    );
  }
}