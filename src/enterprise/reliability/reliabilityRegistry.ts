import { ReliabilityPolicy, ReliabilityTarget } from "./reliabilityTypes";

export class ReliabilityRegistry {
  private readonly targets = new Map<string, ReliabilityTarget>();
  private readonly policies = new Map<string, ReliabilityPolicy>();

  registerTarget(target: ReliabilityTarget): void {
    this.targets.set(target.id, target);
  }

  registerPolicy(policy: ReliabilityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  getTarget(targetId: string): ReliabilityTarget | undefined {
    return this.targets.get(targetId);
  }

  listTargets(): ReliabilityTarget[] {
    return Array.from(this.targets.values());
  }

  listPolicies(): ReliabilityPolicy[] {
    return Array.from(this.policies.values());
  }
}