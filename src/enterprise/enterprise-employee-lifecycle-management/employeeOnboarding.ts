export interface EmployeeOnboardingTask {
  id: string;
  name: string;
  completed: boolean;
}

export interface EmployeeOnboarding {
  employeeId: string;
  tasks: EmployeeOnboardingTask[];
}

export function isOnboardingComplete(
  onboarding: EmployeeOnboarding
): boolean {
  return onboarding.tasks.every(
    (task) => task.completed
  );
}
