import { BusinessContinuityPlan } from "./businessContinuityTypes";

export type BusinessContinuityReport = {
  totalPlans: number;
  activePlans: number;
  testedPlans: number;
  draftPlans: number;
};

export function generateBusinessContinuityReport(
  plans: BusinessContinuityPlan[],
): BusinessContinuityReport {
  return {
    totalPlans: plans.length,
    activePlans: plans.filter((p) => p.status === "active").length,
    testedPlans: plans.filter((p) => p.status === "tested").length,
    draftPlans: plans.filter((p) => p.status === "draft").length,
  };
}

export function calculateBusinessContinuityReadiness(
  report: BusinessContinuityReport,
): number {
  if (report.totalPlans === 0) {
    return 0;
  }

  return Math.round(
    ((report.activePlans + report.testedPlans) / report.totalPlans) * 100,
  );
}