import {
  ExtractedKnowledgeEntity,
  KnowledgeExtractionResult,
  KnowledgeExtractionSource,
} from "./knowledgeExtractionTypes";

export class KnowledgeExtractionEngine {
  extract(source: KnowledgeExtractionSource): KnowledgeExtractionResult {
    const entities: ExtractedKnowledgeEntity[] = [];

    entities.push({
      id: crypto.randomUUID(),
      nodeType: "organization",
      title: source.title,
      description: source.content.slice(0, 240),
      confidence: "medium",
      sourceId: source.id,
    });

    return {
      sourceId: source.id,
      entities,
      relations: [],
      extractedAt: new Date().toISOString(),
    };
  }
}