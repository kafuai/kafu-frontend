import { AIGovernedModel } from "./aiModelGovernance";

export class AIGovernanceModelRegistry {
  private readonly models = new Map<string, AIGovernedModel>();

  register(model: AIGovernedModel): void {
    this.models.set(model.id, model);
  }

  get(modelId: string): AIGovernedModel | undefined {
    return this.models.get(modelId);
  }

  list(): AIGovernedModel[] {
    return [...this.models.values()];
  }

  remove(modelId: string): boolean {
    return this.models.delete(modelId);
  }

  clear(): void {
    this.models.clear();
  }
}