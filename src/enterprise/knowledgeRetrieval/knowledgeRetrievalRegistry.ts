import { KnowledgeRetrievalProvider } from "./knowledgeRetrievalProvider";
import { KnowledgeRetrievalRequest } from "./knowledgeRetrievalRequest";

export class KnowledgeRetrievalRegistry {
  private readonly providers = new Map<string, KnowledgeRetrievalProvider>();

  register(provider: KnowledgeRetrievalProvider): void {
    this.providers.set(provider.id, provider);
  }

  unregister(providerId: string): void {
    this.providers.delete(providerId);
  }

  get(providerId: string): KnowledgeRetrievalProvider | undefined {
    return this.providers.get(providerId);
  }

  getAll(): readonly KnowledgeRetrievalProvider[] {
    return [...this.providers.values()];
  }

  resolve(
    request: KnowledgeRetrievalRequest,
  ): readonly KnowledgeRetrievalProvider[] {
    return this.getAll().filter((provider) => provider.canHandle(request));
  }
}