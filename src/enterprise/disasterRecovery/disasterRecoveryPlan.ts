import {
  DisasterRecoveryAssessment,
  DisasterRecoveryPlan,
  DisasterRecoveryPlanInput,
} from "./disasterRecoveryTypes";

function createDisasterRecoveryId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDisasterRecoveryPlan(
  input: DisasterRecoveryPlanInput,
): DisasterRecoveryPlan {
  const now = new Date().toISOString();

  return {
    id: createDisasterRecoveryId("dr_plan"),
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    status: "draft",
    severity: input.severity,
    strategy: input.strategy,
    owner: input.owner,
    businessServices: input.businessServices ?? [],
    systems: input.systems ?? [],
    dependencies: input.dependencies ?? [],
    recoverySiteIds: input.recoverySiteIds ?? [],
    backupStrategyIds: input.backupStrategyIds ?? [],
    rtoMinutes: input.rtoMinutes,
    rpoMinutes: input.rpoMinutes,
    createdAt: now,
    updatedAt: now,
  };
}

export function activateDisasterRecoveryPlan(
  plan: DisasterRecoveryPlan,
): DisasterRecoveryPlan {
  return {
    ...plan,
    status: "active",
    updatedAt: new Date().toISOString(),
  };
}

export function retireDisasterRecoveryPlan(
  plan: DisasterRecoveryPlan,
): DisasterRecoveryPlan {
  return {
    ...plan,
    status: "retired",
    updatedAt: new Date().toISOString(),
  };
}

export function assessDisasterRecoveryPlan(
  plan: DisasterRecoveryPlan,
): DisasterRecoveryAssessment {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (plan.rtoMinutes <= 0) {
    issues.push("Recovery Time Objective must be greater than zero.");
  }

  if (plan.rpoMinutes < 0) {
    issues.push("Recovery Point Objective cannot be negative.");
  }

  if (plan.systems.length === 0) {
    issues.push("No systems are mapped to this disaster recovery plan.");
    recommendations.push("Map all critical systems covered by this plan.");
  }

  if (plan.recoverySiteIds.length === 0) {
    issues.push("No recovery sites are assigned.");
    recommendations.push("Assign at least one recovery site.");
  }

  if (plan.backupStrategyIds.length === 0) {
    issues.push("No backup strategies are assigned.");
    recommendations.push("Attach validated backup strategies to the plan.");
  }

  if (plan.owner.trim().length === 0) {
    issues.push("Plan owner is missing.");
  }

  return {
    planId: plan.id,
    isRecoverable: issues.length === 0,
    issues,
    recommendations,
  };
}