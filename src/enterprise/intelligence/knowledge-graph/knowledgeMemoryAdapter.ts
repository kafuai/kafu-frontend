import {
  KnowledgeMemoryAdapterResult,
  KnowledgeMemoryItem,
} from "./knowledgeMemoryAdapterTypes";

export class KnowledgeMemoryAdapter {
  adapt(memoryItems: KnowledgeMemoryItem[]): KnowledgeMemoryAdapterResult {
    return {
      sources: memoryItems.map((item) => ({
        id: item.id,
        type: "organization_memory",
        title: item.title,
        content: item.content,
        metadata: {
          category: item.category,
          ...item.metadata,
        },
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}