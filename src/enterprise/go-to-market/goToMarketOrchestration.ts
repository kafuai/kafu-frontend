import { GoToMarketStrategicLaunchPlan } from "./goToMarketLaunchPlan";
import { GoToMarketReadinessAssessment } from "./goToMarketReadiness";

export interface GoToMarketOrchestrationResult {
  launchPlanId: string;
  status: "ready" | "blocked";
  orchestrationNotes: string[];
  evaluatedAt: string;
}

export function orchestrateGoToMarketLaunch(
  launchPlan: GoToMarketStrategicLaunchPlan,
  readiness: GoToMarketReadinessAssessment,
): GoToMarketOrchestrationResult {
  return {
    launchPlanId: launchPlan.id,
    status: readiness.readyForLaunch ? "ready" : "blocked",
    orchestrationNotes: readiness.readyForLaunch
      ? ["Launch orchestration is ready."]
      : ["Launch orchestration is blocked by readiness gaps."],
    evaluatedAt: new Date().toISOString(),
  };
}