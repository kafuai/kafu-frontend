import { DisasterRecoveryEvent } from "./disasterRecoveryEvents";
import { DisasterRecoveryPlan } from "./disasterRecoveryTypes";

export type DisasterRecoveryReport = {
  generatedAt: string;
  totalPlans: number;
  activePlans: number;
  testedPlans: number;
  totalEvents: number;
  averageRtoMinutes: number;
  averageRpoMinutes: number;
};

export function generateDisasterRecoveryReport(
  plans: DisasterRecoveryPlan[],
  events: DisasterRecoveryEvent[],
): DisasterRecoveryReport {
  const activePlans = plans.filter(
    (plan) => plan.status === "active",
  ).length;

  const testedPlans = plans.filter(
    (plan) => plan.lastTestedAt !== undefined,
  ).length;

  const averageRtoMinutes =
    plans.length === 0
      ? 0
      : plans.reduce((sum, plan) => sum + plan.rtoMinutes, 0) /
        plans.length;

  const averageRpoMinutes =
    plans.length === 0
      ? 0
      : plans.reduce((sum, plan) => sum + plan.rpoMinutes, 0) /
        plans.length;

  return {
    generatedAt: new Date().toISOString(),
    totalPlans: plans.length,
    activePlans,
    testedPlans,
    totalEvents: events.length,
    averageRtoMinutes,
    averageRpoMinutes,
  };
}