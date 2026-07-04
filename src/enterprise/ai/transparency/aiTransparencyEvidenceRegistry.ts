import { AITransparencyEvidence } from "./aiTransparencyEvidence";

export class AITransparencyEvidenceRegistry {
  private readonly evidence = new Map<string, AITransparencyEvidence>();

  register(item: AITransparencyEvidence): void {
    this.evidence.set(item.id, item);
  }

  get(id: string): AITransparencyEvidence | undefined {
    return this.evidence.get(id);
  }

  list(): AITransparencyEvidence[] {
    return [...this.evidence.values()];
  }

  listByTransparencyRecord(
    transparencyRecordId: string,
  ): AITransparencyEvidence[] {
    return this.list().filter(
      item => item.transparencyRecordId === transparencyRecordId,
    );
  }

  remove(id: string): boolean {
    return this.evidence.delete(id);
  }

  clear(): void {
    this.evidence.clear();
  }
}