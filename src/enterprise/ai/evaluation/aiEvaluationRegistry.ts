import { AIEvaluationRun } from "./aiEvaluationTypes";

export class AIEvaluationRegistry {
  private readonly runs = new Map<string, AIEvaluationRun>();

  register(run: AIEvaluationRun): void {
    this.runs.set(run.id, run);
  }

  unregister(id: string): boolean {
    return this.runs.delete(id);
  }

  get(id: string): AIEvaluationRun | undefined {
    return this.runs.get(id);
  }

  list(): AIEvaluationRun[] {
    return [...this.runs.values()];
  }

  listByOrganization(organizationId: string): AIEvaluationRun[] {
    return this.list().filter(
      (run) => run.organizationId === organizationId,
    );
  }

  clear(): void {
    this.runs.clear();
  }
}