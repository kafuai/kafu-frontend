import { AIExplanation } from "./aiExplanation";

export class AIExplanationRegistry {
  private readonly explanations = new Map<string, AIExplanation>();

  register(explanation: AIExplanation): void {
    this.explanations.set(explanation.id, explanation);
  }

  get(id: string): AIExplanation | undefined {
    return this.explanations.get(id);
  }

  list(): AIExplanation[] {
    return [...this.explanations.values()];
  }

  listByTransparencyRecord(
    transparencyRecordId: string,
  ): AIExplanation[] {
    return this.list().filter(
      explanation =>
        explanation.transparencyRecordId === transparencyRecordId,
    );
  }

  remove(id: string): boolean {
    return this.explanations.delete(id);
  }

  clear(): void {
    this.explanations.clear();
  }
}