import { GovernancePolicy } from "./governancePolicy";

export class GovernancePolicyRegistry {
  private readonly policies = new Map<string, GovernancePolicy>();

  register(policy: GovernancePolicy): void {
    this.policies.set(policy.id, policy);
  }

  unregister(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  get(policyId: string): GovernancePolicy | undefined {
    return this.policies.get(policyId);
  }

  list(): GovernancePolicy[] {
    return [...this.policies.values()];
  }

  clear(): void {
    this.policies.clear();
  }
}