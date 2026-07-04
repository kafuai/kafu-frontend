import { AIAutonomousExecutionAssuranceInput } from "./aiAutonomousExecutionAssuranceTypes";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function scoreExecutionAssurance(
  input: AIAutonomousExecutionAssuranceInput,
): number {
  const signalScore =
    input.signals.length === 0
      ? 1
      : input.signals.reduce(
          (sum, signal) =>
            sum +
            (signal.passed ? signal.confidence * signal.weight : 0),
          0,
        ) /
        input.signals.reduce(
          (sum, signal) => sum + signal.weight,
          0,
        );

  const score =
    input.verificationScore * 0.35 +
    (1 - input.riskScore) * 0.25 +
    input.operationalReadinessScore * 0.2 +
    input.auditCoverageScore * 0.1 +
    signalScore * 0.1;

  return clamp(score);
}