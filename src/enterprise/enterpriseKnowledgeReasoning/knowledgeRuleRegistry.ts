import {
  KnowledgeReasoningRule,
  createKnowledgeReasoningRule,
} from "./knowledgeReasoningRule";

export class KnowledgeRuleRegistry {
  private readonly rules = new Map<string, KnowledgeReasoningRule>();

  register(rule: KnowledgeReasoningRule): void {
    this.rules.set(rule.id, createKnowledgeReasoningRule(rule));
  }

  get(id: string): KnowledgeReasoningRule | undefined {
    return this.rules.get(id);
  }

  getAll(): readonly KnowledgeReasoningRule[] {
    return [...this.rules.values()];
  }

  remove(id: string): boolean {
    return this.rules.delete(id);
  }

  clear(): void {
    this.rules.clear();
  }

  count(): number {
    return this.rules.size;
  }
}