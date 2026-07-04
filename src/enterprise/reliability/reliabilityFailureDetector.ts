import {
  ReliabilityAssessment,
  ReliabilityFailure,
  ReliabilitySeverity,
  ReliabilityStatus,
  ReliabilityTarget,
} from "./reliabilityTypes";

function resolveReliabilityStatus(
  failures: ReliabilityFailure[],
): ReliabilityStatus {
  if (failures.some((failure) => failure.severity === "critical")) {
    return "failed";
  }

  if (failures.some((failure) => failure.severity === "high")) {
    return "unstable";
  }

  if (failures.length > 0) {
    return "degraded";
  }

  return "healthy";
}

function resolveHighestSeverity(
  failures: ReliabilityFailure[],
  target: ReliabilityTarget,
): ReliabilitySeverity {
  const order: ReliabilitySeverity[] = ["low", "medium", "high", "critical"];

  return failures.reduce<ReliabilitySeverity>((highest, failure) => {
    return order.indexOf(failure.severity) > order.indexOf(highest)
      ? failure.severity
      : highest;
  }, target.criticality);
}

export function detectReliabilityFailures(
  target: ReliabilityTarget,
  failures: ReliabilityFailure[],
): ReliabilityAssessment {
  const targetFailures = failures.filter(
    (failure) => failure.targetId === target.id,
  );

  return {
    targetId: target.id,
    status: resolveReliabilityStatus(targetFailures),
    severity: resolveHighestSeverity(targetFailures, target),
    failures: targetFailures,
    assessedAt: new Date(),
  };
}