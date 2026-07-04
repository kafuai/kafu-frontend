import {
  EnterpriseInitiative,
  InitiativeLifecycleState,
} from "./initiativeTypes";
import { evaluateInitiativeReadiness } from "./initiativeReadinessEvaluator";

export interface InitiativeLifecyclePlan {
  initiativeId: string;
  currentState: InitiativeLifecycleState;
  recommendedState: InitiativeLifecycleState;
  requiredActions: string[];
  canAdvance: boolean;
}

export function planInitiativeLifecycle(
  initiative: EnterpriseInitiative,
): InitiativeLifecyclePlan {
  const readiness = evaluateInitiativeReadiness(initiative);
  const requiredActions: string[] = [];

  if (readiness.blockers.length > 0) {
    requiredActions.push(...readiness.blockers);
  }

  if (readiness.warnings.length > 0) {
    requiredActions.push(...readiness.warnings);
  }

  let recommendedState: InitiativeLifecycleState = initiative.lifecycleState;

  if (readiness.readinessState === "blocked") {
    recommendedState = "blocked";
  } else if (initiative.lifecycleState === "draft") {
    recommendedState = "proposed";
    requiredActions.push("Submit initiative for approval.");
  } else if (initiative.lifecycleState === "proposed") {
    recommendedState = "approved";
    requiredActions.push("Approve initiative governance package.");
  } else if (
    initiative.lifecycleState === "approved" &&
    readiness.readinessScore >= 80
  ) {
    recommendedState = "ready";
    requiredActions.push("Prepare execution kickoff.");
  } else if (
    initiative.lifecycleState === "ready" &&
    readiness.readinessScore >= 85
  ) {
    recommendedState = "active";
    requiredActions.push("Start initiative execution.");
  } else if (
    initiative.lifecycleState === "active" &&
    readiness.readinessScore < 60
  ) {
    recommendedState = "at_risk";
    requiredActions.push("Escalate initiative risk review.");
  }

  return {
    initiativeId: initiative.initiativeId,
    currentState: initiative.lifecycleState,
    recommendedState,
    requiredActions,
    canAdvance:
      recommendedState !== initiative.lifecycleState &&
      recommendedState !== "blocked" &&
      readiness.blockers.length === 0,
  };
}