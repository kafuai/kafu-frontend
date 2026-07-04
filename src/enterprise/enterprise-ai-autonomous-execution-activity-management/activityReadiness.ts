import type {
  ActivityReadinessSignal,
  EnterpriseExecutionActivity,
} from "./activityTypes";

export function evaluateActivityReadiness(
  activity: EnterpriseExecutionActivity,
  completedActivityIds: string[]
): ActivityReadinessSignal {
  const missingDependencies = activity.dependencies.filter(
    (dependencyId) => !completedActivityIds.includes(dependencyId)
  );

  const activeBlockers = [...activity.blockers];

  const dependencyScore =
    activity.dependencies.length === 0
      ? 50
      : Math.round(
          ((activity.dependencies.length - missingDependencies.length) /
            activity.dependencies.length) *
            50
        );

  const blockerScore = activeBlockers.length === 0 ? 50 : 0;

  const readinessScore = dependencyScore + blockerScore;
  const isReady = readinessScore === 100;

  return {
    activityId: activity.id,
    isReady,
    missingDependencies,
    activeBlockers,
    readinessScore,
    recommendation: isReady
      ? "Activity is ready for execution."
      : "Resolve dependencies and blockers before execution.",
  };
}