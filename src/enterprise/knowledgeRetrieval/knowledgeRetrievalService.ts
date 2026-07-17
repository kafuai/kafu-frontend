import { KnowledgeRetrievalEngine } from "./knowledgeRetrievalEngine";
import { KnowledgeRetrievalRegistry } from "./knowledgeRetrievalRegistry";
import { KnowledgeRetrievalRequest } from "./knowledgeRetrievalRequest";
import {
  KnowledgeRetrievalResult,
  RetrievedKnowledgeItem,
} from "./knowledgeRetrievalResult";

export class KnowledgeRetrievalService
  implements KnowledgeRetrievalEngine
{
  constructor(
    private readonly registry: KnowledgeRetrievalRegistry,
  ) {}

  async retrieve(
    request: KnowledgeRetrievalRequest,
  ): Promise<KnowledgeRetrievalResult> {
    const providers = this.registry.resolve(request);

    const collected: RetrievedKnowledgeItem[] = [];

    for (const provider of providers) {
      const items = await provider.retrieve(request);
      collected.push(...items);
    }

    const ranked = this.rank(
      collected,
      request.ranking.maximumResults,
    );

    return {
      requestId: request.requestId,
      status: "completed",
      totalMatches: ranked.length,
      processingTimeMs: 0,
      results: ranked,
      generatedAt: new Date().toISOString(),
    };
  }

  private rank(
    items: readonly RetrievedKnowledgeItem[],
    limit: number,
  ): RetrievedKnowledgeItem[] {
    return [...items]
      .sort(
        (a, b) =>
          b.relevanceScore - a.relevanceScore ||
          b.confidenceScore - a.confidenceScore,
      )
      .slice(0, limit);
  }
}