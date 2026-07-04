import type {
  ActivityExecutionSummary,
  ActivityReadinessSignal,
  EnterpriseExecutionActivity,
} from "./activityTypes";
import { evaluateActivityReadiness } from "./activityReadiness";
import { summarizeActivities } from "./activityProgress";
import {
  ActivityOperationalSignal,
  generateActivityOperationalSignals,
} from "./activitySignals";

export interface ActivityOrchestrationResult {
  summary: ActivityExecutionSummary;
  readinessSignals: ActivityReadinessSignal[];
  operationalSignals: ActivityOperationalSignal[];
  nextRecommendedActivityIds: string[];
}

export function orchestrateActivities(
  activities: EnterpriseExecutionActivity[],
  completedActivityIds: string[]
): ActivityOrchestrationResult {
  const summary = summarizeActivities(activities);

  const readinessSignals = activities.map((activity) =>
    evaluateActivityReadiness(activity, completedActivityIds)
  );

  const operationalSignals = generateActivityOperationalSignals(activities);

  const nextRecommendedActivityIds = readinessSignals
    .filter((signal) => signal.isReady)
    .map((signal) => signal.activityId);

  return {
    summary,
    readinessSignals,
    operationalSignals,
    nextRecommendedActivityIds,
  };
}