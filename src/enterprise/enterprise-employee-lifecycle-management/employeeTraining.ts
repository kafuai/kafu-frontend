export interface EmployeeTrainingRecord {
  employeeId: string;
  trainingName: string;
  completed: boolean;
  completedAt?: string;
}

export function isTrainingCompleted(
  record: EmployeeTrainingRecord
): boolean {
  return record.completed;
}

export function completeTraining(
  record: EmployeeTrainingRecord
): EmployeeTrainingRecord {
  return {
    ...record,
    completed: true,
    completedAt: new Date().toISOString(),
  };
}
