import { AIGovernancePolicy } from "./aiGovernanceTypes";
import { AIGovernedModel } from "./aiModelGovernance";

export interface AIGovernanceRegistrySnapshot {
  organizationId: string;
  policies: AIGovernancePolicy[];
  models: AIGovernedModel[];
  generatedAt: Date;
}

export class AIGovernanceRegistry {
  private readonly policies = new Map<string, AIGovernancePolicy>();
  private readonly models = new Map<string, AIGovernedModel>();

  registerPolicy(policy: AIGovernancePolicy): void {
    this.policies.set(policy.id, policy);
  }

  registerModel(model: AIGovernedModel): void {
    this.models.set(model.id, model);
  }

  getPolicy(policyId: string): AIGovernancePolicy | undefined {
    return this.policies.get(policyId);
  }

  getModel(modelId: string): AIGovernedModel | undefined {
    return this.models.get(modelId);
  }

  listPolicies(): AIGovernancePolicy[] {
    return [...this.policies.values()];
  }

  listModels(): AIGovernedModel[] {
    return [...this.models.values()];
  }

  snapshot(organizationId: string): AIGovernanceRegistrySnapshot {
    return {
      organizationId,
      policies: this.listPolicies().filter(
        (policy) => policy.organizationId === organizationId,
      ),
      models: this.listModels().filter(
        (model) => model.organizationId === organizationId,
      ),
      generatedAt: new Date(),
    };
  }
}