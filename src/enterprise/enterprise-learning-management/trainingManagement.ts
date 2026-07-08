export interface TrainingManagement {
  trainingId: string;
  participants: string[];
  completed: number;
  total: number;
}

export function calculateTrainingCompletion(
  training: TrainingManagement
): number {
  if (!training.total) return 0;

  return Math.round(
    (training.completed / training.total) * 100
  );
}
