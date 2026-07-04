import { ResiliencePolicy } from "./resilienceTypes";

export class ResiliencePolicyRegistry {
  private readonly policies = new Map<string, ResiliencePolicy>();

  register(policy: ResiliencePolicy): void {
    this.policies.set(policy.id, policy);
  }

  get(policyId: string): ResiliencePolicy | undefined {
    return this.policies.get(policyId);
  }

  list(): ResiliencePolicy[] {
    return [...this.policies.values()];
  }

  listEnabled(): ResiliencePolicy[] {
    return this.list().filter((policy) => policy.enabled);
  }

  remove(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  clear(): void {
    this.policies.clear();
  }
}