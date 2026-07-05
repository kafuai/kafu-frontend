import type { OperationalGovernanceRule } from "./operationalGovernance";

export class OperationalGovernanceRegistry {
  private readonly rules = new Map<string, OperationalGovernanceRule>();

  register(rule: OperationalGovernanceRule): void {
    this.rules.set(rule.id, rule);
  }

  getById(id: string): OperationalGovernanceRule | undefined {
    return this.rules.get(id);
  }

  list(): readonly OperationalGovernanceRule[] {
    return Array.from(this.rules.values());
  }

  listActive(): readonly OperationalGovernanceRule[] {
    return this.list().filter((rule) => rule.status === "active");
  }

  listRequiringReview(currentDate: string): readonly OperationalGovernanceRule[] {
    return this.list().filter(
      (rule) => rule.status === "under_review" || rule.reviewBy <= currentDate,
    );
  }

  clear(): void {
    this.rules.clear();
  }
}