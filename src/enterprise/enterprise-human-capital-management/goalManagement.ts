export interface EmployeeGoal {
  employeeId: string;
  goal: string;
  progress: number;
  completed: boolean;
}

export function calculateGoalCompletion(
  goals: EmployeeGoal[]
): number {
  if (!goals.length) return 0;

  return Math.round(
    (goals.filter((goal) => goal.completed).length /
      goals.length) *
      100
  );
}
