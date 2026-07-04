import { BusinessContinuityPlan } from "./businessContinuityTypes";

export class BusinessContinuityRegistry {
  private readonly plans = new Map<string, BusinessContinuityPlan>();

  register(plan: BusinessContinuityPlan): void {
    this.plans.set(plan.id, plan);
  }

  get(id: string): BusinessContinuityPlan | undefined {
    return this.plans.get(id);
  }

  getAll(): BusinessContinuityPlan[] {
    return [...this.plans.values()];
  }

  remove(id: string): boolean {
    return this.plans.delete(id);
  }

  clear(): void {
    this.plans.clear();
  }
}