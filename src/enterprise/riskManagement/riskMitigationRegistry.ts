import { EnterpriseRiskMitigationPlan } from "./riskMitigation";

export class EnterpriseRiskMitigationRegistry {
  private readonly plans = new Map<string, EnterpriseRiskMitigationPlan>();

  register(plan: EnterpriseRiskMitigationPlan): void {
    this.plans.set(plan.planId, plan);
  }

  get(planId: string): EnterpriseRiskMitigationPlan | undefined {
    return this.plans.get(planId);
  }

  list(): EnterpriseRiskMitigationPlan[] {
    return [...this.plans.values()];
  }

  listByRisk(riskId: string): EnterpriseRiskMitigationPlan[] {
    return this.list().filter((plan) => plan.riskId === riskId);
  }

  remove(planId: string): boolean {
    return this.plans.delete(planId);
  }

  clear(): void {
    this.plans.clear();
  }
}