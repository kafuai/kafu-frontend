import { SecurityPolicy } from "./securityPolicy";

export class SecurityPolicyRegistry {
  private readonly policies = new Map<string, SecurityPolicy>();

  register(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  get(id: string): SecurityPolicy | undefined {
    return this.policies.get(id);
  }

  list(): SecurityPolicy[] {
    return [...this.policies.values()];
  }

  has(id: string): boolean {
    return this.policies.has(id);
  }

  remove(id: string): boolean {
    return this.policies.delete(id);
  }

  clear(): void {
    this.policies.clear();
  }
}