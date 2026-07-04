export type BusinessContinuityExerciseType =
  | "tabletop"
  | "simulation"
  | "technical"
  | "full_scale";

export type BusinessContinuityExerciseStatus =
  | "planned"
  | "running"
  | "completed"
  | "cancelled";

export type BusinessContinuityExercise = {
  id: string;
  name: string;
  type: BusinessContinuityExerciseType;
  status: BusinessContinuityExerciseStatus;
  scheduledAt: string;
  completedAt?: string;
  participants: string[];
  findings: string[];
};

export function startBusinessContinuityExercise(
  exercise: BusinessContinuityExercise,
): BusinessContinuityExercise {
  return {
    ...exercise,
    status: "running",
  };
}

export function completeBusinessContinuityExercise(
  exercise: BusinessContinuityExercise,
  findings: string[],
): BusinessContinuityExercise {
  return {
    ...exercise,
    status: "completed",
    completedAt: new Date().toISOString(),
    findings,
  };
}

export function isBusinessContinuityExerciseSuccessful(
  exercise: BusinessContinuityExercise,
): boolean {
  return (
    exercise.status === "completed" &&
    exercise.findings.length === 0
  );
}