export type ReliabilitySloWindow = "daily" | "weekly" | "monthly";

export type ReliabilitySloTarget = {
  id: string;
  service: string;
  availabilityTarget: number;
  latencyTargetMs?: number;
  errorRateTarget?: number;
  window: ReliabilitySloWindow;
};

export type ReliabilitySloMeasurement = {
  targetId: string;
  availability: number;
  latencyMs?: number;
  errorRate?: number;
  measuredAt: Date;
};

export type ReliabilitySloEvaluation = {
  targetId: string;
  met: boolean;
  violations: string[];
  evaluatedAt: Date;
};

export function evaluateReliabilitySlo(
  target: ReliabilitySloTarget,
  measurement: ReliabilitySloMeasurement,
): ReliabilitySloEvaluation {
  const violations: string[] = [];

  if (measurement.availability < target.availabilityTarget) {
    violations.push("Availability target was not met.");
  }

  if (
    target.latencyTargetMs !== undefined &&
    measurement.latencyMs !== undefined &&
    measurement.latencyMs > target.latencyTargetMs
  ) {
    violations.push("Latency target was not met.");
  }

  if (
    target.errorRateTarget !== undefined &&
    measurement.errorRate !== undefined &&
    measurement.errorRate > target.errorRateTarget
  ) {
    violations.push("Error rate target was not met.");
  }

  return {
    targetId: target.id,
    met: violations.length === 0,
    violations,
    evaluatedAt: new Date(),
  };
}