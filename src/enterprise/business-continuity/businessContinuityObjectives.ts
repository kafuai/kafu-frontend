import {
  BusinessContinuityRecoveryObjective,
  BusinessContinuityTimeUnit,
} from "./businessContinuityTypes";

const unitToMinutes: Record<BusinessContinuityTimeUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
};

export function recoveryObjectiveToMinutes(
  objective: BusinessContinuityRecoveryObjective,
): {
  rtoMinutes: number;
  rpoMinutes: number;
  maximumTolerableDowntimeMinutes?: number;
} {
  return {
    rtoMinutes: objective.rto * unitToMinutes[objective.unit],
    rpoMinutes: objective.rpo * unitToMinutes[objective.unit],
    maximumTolerableDowntimeMinutes:
      objective.maximumTolerableDowntime === undefined
        ? undefined
        : objective.maximumTolerableDowntime * unitToMinutes[objective.unit],
  };
}

export function isRecoveryObjectiveBreached(
  objective: BusinessContinuityRecoveryObjective,
  actualRecoveryTimeMinutes: number,
  actualDataLossMinutes: number,
): boolean {
  const normalized = recoveryObjectiveToMinutes(objective);

  return (
    actualRecoveryTimeMinutes > normalized.rtoMinutes ||
    actualDataLossMinutes > normalized.rpoMinutes
  );
}

export function calculateRecoveryObjectiveSeverity(
  objective: BusinessContinuityRecoveryObjective,
  actualRecoveryTimeMinutes: number,
  actualDataLossMinutes: number,
): "none" | "minor" | "major" | "severe" {
  const normalized = recoveryObjectiveToMinutes(objective);

  const recoveryRatio = actualRecoveryTimeMinutes / normalized.rtoMinutes;
  const dataLossRatio = actualDataLossMinutes / normalized.rpoMinutes;
  const worstRatio = Math.max(recoveryRatio, dataLossRatio);

  if (worstRatio <= 1) {
    return "none";
  }

  if (worstRatio <= 1.25) {
    return "minor";
  }

  if (worstRatio <= 2) {
    return "major";
  }

  return "severe";
}