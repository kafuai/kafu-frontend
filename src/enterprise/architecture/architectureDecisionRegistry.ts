import { ArchitectureDecision } from "./architectureDecision";

export class ArchitectureDecisionRegistry {
  private readonly decisions = new Map<string, ArchitectureDecision>();

  register(decision: ArchitectureDecision): void {
    this.decisions.set(decision.id, decision);
  }

  get(id: string): ArchitectureDecision | undefined {
    return this.decisions.get(id);
  }

  getAll(): ArchitectureDecision[] {
    return [...this.decisions.values()];
  }

  remove(id: string): boolean {
    return this.decisions.delete(id);
  }

  clear(): void {
    this.decisions.clear();
  }
}