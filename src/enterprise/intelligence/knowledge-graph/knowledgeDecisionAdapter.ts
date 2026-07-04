import {
  KnowledgeDecisionAdapterResult,
  KnowledgeDecisionItem,
} from "./knowledgeDecisionAdapterTypes";

export class KnowledgeDecisionAdapter {
  adapt(decisions: KnowledgeDecisionItem[]): KnowledgeDecisionAdapterResult {
    return {
      sources: decisions.map((decision) => ({
        id: decision.id,
        type: "decision",
        title: decision.title,
        content: [
          decision.summary,
          decision.impact ? `Impact: ${decision.impact}` : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
        metadata: decision.metadata,
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}