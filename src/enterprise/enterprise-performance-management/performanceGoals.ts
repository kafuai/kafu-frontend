export interface PerformanceGoal {
  employeeId: string;
  title: string;
  target: number;
  achieved: number;
}

export function calculateGoalAchievement(
  goal: PerformanceGoal
): number {
  if (!goal.target) return 0;

  return Math.round(
    (goal.achieved / goal.target) * 100
  );
}

export function isGoalCompleted(
  goal: PerformanceGoal
): boolean {
  return goal.achieved >= goal.target;
}
