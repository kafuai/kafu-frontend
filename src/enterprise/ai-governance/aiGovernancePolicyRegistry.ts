import { AIGovernancePolicy } from "./aiGovernanceTypes";

export class AIGovernancePolicyRegistry {
  private readonly policies = new Map<string, AIGovernancePolicy>();

  register(policy: AIGovernancePolicy): void {
    this.policies.set(policy.id, policy);
  }

  get(policyId: string): AIGovernancePolicy | undefined {
    return this.policies.get(policyId);
  }

  list(): AIGovernancePolicy[] {
    return [...this.policies.values()];
  }

  remove(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  clear(): void {
    this.policies.clear();
  }
}