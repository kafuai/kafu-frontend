import {
  KnowledgeReasoningConclusion,
  createKnowledgeReasoningConclusion,
} from "./knowledgeReasoningConclusion";

export class KnowledgeConclusionRegistry {
  private readonly conclusions =
    new Map<string, KnowledgeReasoningConclusion>();

  register(conclusion: KnowledgeReasoningConclusion): void {
    this.conclusions.set(
      conclusion.id,
      createKnowledgeReasoningConclusion(conclusion),
    );
  }

  get(id: string): KnowledgeReasoningConclusion | undefined {
    return this.conclusions.get(id);
  }

  getAll(): readonly KnowledgeReasoningConclusion[] {
    return [...this.conclusions.values()];
  }

  clear(): void {
    this.conclusions.clear();
  }

  count(): number {
    return this.conclusions.size;
  }
}