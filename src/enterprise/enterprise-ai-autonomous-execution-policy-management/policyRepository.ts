import {
  EnterpriseExecutionPolicy
} from "./policyTypes";

export class EnterpriseExecutionPolicyRepository {
  private readonly policies = new Map<string, EnterpriseExecutionPolicy>();

  save(policy: EnterpriseExecutionPolicy): void {
    this.policies.set(policy.id, policy);
  }

  get(id: string): EnterpriseExecutionPolicy | undefined {
    return this.policies.get(id);
  }

  getAll(): EnterpriseExecutionPolicy[] {
    return [...this.policies.values()];
  }

  remove(id: string): boolean {
    return this.policies.delete(id);
  }

  exists(id: string): boolean {
    return this.policies.has(id);
  }

  clear(): void {
    this.policies.clear();
  }
}