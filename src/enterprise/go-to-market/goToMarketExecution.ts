import {
  GoToMarketPlan,
  GoToMarketStatus,
} from "./goToMarketTypes";
import {
  GoToMarketLaunchPlan,
  isGoToMarketLaunchReady,
} from "./goToMarketLaunch";

export interface GoToMarketExecutionResult {
  planId: string;
  launchId: string;
  status: GoToMarketStatus;
  startedAt: string;
  message: string;
}

export function executeGoToMarketLaunch(
  plan: GoToMarketPlan,
  launchPlan: GoToMarketLaunchPlan,
): GoToMarketExecutionResult {
  const ready = isGoToMarketLaunchReady(launchPlan);

  return {
    planId: plan.id,
    launchId: launchPlan.id,
    status: ready ? "active" : "blocked",
    startedAt: new Date().toISOString(),
    message: ready
      ? "Go-To-Market launch started successfully."
      : "Launch requirements are not yet satisfied.",
  };
}