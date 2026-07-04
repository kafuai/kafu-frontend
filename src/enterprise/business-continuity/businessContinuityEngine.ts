import { BusinessContinuityRegistry } from "./businessContinuityRegistry";
import { BusinessContinuityPlan } from "./businessContinuityTypes";
import {
  activateBusinessContinuityPlan,
  createBusinessContinuityPlan,
} from "./businessContinuityPlan";

export class BusinessContinuityEngine {
  constructor(
    private readonly registry: BusinessContinuityRegistry,
  ) {}

  register(plan: BusinessContinuityPlan): BusinessContinuityPlan {
    const created = createBusinessContinuityPlan(plan);
    this.registry.register(created);
    return created;
  }

  activate(planId: string): BusinessContinuityPlan | undefined {
    const plan = this.registry.get(planId);

    if (!plan) {
      return undefined;
    }

    const activated = activateBusinessContinuityPlan(plan);

    this.registry.register(activated);

    return activated;
  }

  list(): BusinessContinuityPlan[] {
    return this.registry.getAll();
  }
}