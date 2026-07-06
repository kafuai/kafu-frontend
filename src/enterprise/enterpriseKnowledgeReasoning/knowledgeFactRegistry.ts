import {
  KnowledgeReasoningFact,
  createKnowledgeReasoningFact,
} from "./knowledgeReasoningFact";

export class KnowledgeFactRegistry {
  private readonly facts = new Map<string, KnowledgeReasoningFact>();

  register(fact: KnowledgeReasoningFact): void {
    this.facts.set(fact.id, createKnowledgeReasoningFact(fact));
  }

  get(id: string): KnowledgeReasoningFact | undefined {
    return this.facts.get(id);
  }

  getAll(): readonly KnowledgeReasoningFact[] {
    return [...this.facts.values()];
  }

  remove(id: string): boolean {
    return this.facts.delete(id);
  }

  clear(): void {
    this.facts.clear();
  }

  count(): number {
    return this.facts.size;
  }
}