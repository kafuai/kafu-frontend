import { ExecutionActivationContext } from "./executionActivationContext";

export interface ExecutionActivationScoreCalculation {
  activationScore: number;
  confidenceScore: number;

  authorizationContribution: number;
  executionReadinessContribution: number;
  resourceReadinessContribution: number;
  operationalReadinessContribution: number;
  monitoringReadinessContribution: number;
  rollbackReadinessContribution: number;
  gateContribution: number;
  dependencyContribution: number;
  checkpointContribution: number;
}

function calculatePercentage(
  completed: number,
  total: number,
): number {
  if (total === 0) {
    return 100;
  }

  return Math.round((completed / total) * 100);
}

export function calculateExecutionActivationScore(
  context: ExecutionActivationContext,
): ExecutionActivationScoreCalculation {
  const authorizationContribution =
    context.authorizationScore * 0.18;

  const executionReadinessContribution =
    context.executionReadinessScore * 0.18;

  const resourceReadinessContribution =
    context.resourceReadinessScore * 0.12;

  const operationalReadinessContribution =
    context.operationalReadinessScore * 0.14;

  const monitoringReadinessContribution =
    context.monitoringReadinessScore * 0.10;

  const rollbackReadinessContribution =
    context.rollbackReadinessScore * 0.08;

  const passedGates = context.gates.filter(
    (gate) => !gate.required || gate.passed,
  ).length;

  const gateScore = calculatePercentage(
    passedGates,
    context.gates.length,
  );

  const gateContribution = gateScore * 0.08;

  const resolvedDependencies =
    context.dependencies.filter(
      (dependency) => dependency.resolved,
    ).length;

  const dependencyScore = calculatePercentage(
    resolvedDependencies,
    context.dependencies.length,
  );

  const dependencyContribution =
    dependencyScore * 0.06;

  const completedCheckpoints =
    context.checkpoints.filter(
      (checkpoint) => checkpoint.completed,
    ).length;

  const checkpointScore = calculatePercentage(
    completedCheckpoints,
    context.checkpoints.length,
  );

  const checkpointContribution =
    checkpointScore * 0.06;

  let activationScore =
    authorizationContribution +
    executionReadinessContribution +
    resourceReadinessContribution +
    operationalReadinessContribution +
    monitoringReadinessContribution +
    rollbackReadinessContribution +
    gateContribution +
    dependencyContribution +
    checkpointContribution;

  if (!context.executionAuthorized) {
    activationScore -= 35;
  }

  const failedRequiredGates =
    context.gates.filter(
      (gate) => gate.required && !gate.passed,
    ).length;

  activationScore -= Math.min(
    25,
    failedRequiredGates * 10,
  );

  const blockingDependencies =
    context.dependencies.filter(
      (dependency) =>
        dependency.blocking &&
        !dependency.resolved,
    ).length;

  activationScore -= Math.min(
    20,
    blockingDependencies * 10,
  );

  const incompleteMandatoryCheckpoints =
    context.checkpoints.filter(
      (checkpoint) =>
        checkpoint.mandatory &&
        !checkpoint.completed,
    ).length;

  activationScore -= Math.min(
    20,
    incompleteMandatoryCheckpoints * 8,
  );

  if (
    context.rollbackEnabled &&
    context.rollbackReadinessScore < 60
  ) {
    activationScore -= 10;
  }

  const confidenceScore = Math.round(
    (
      context.authorizationScore +
      context.executionReadinessScore +
      context.operationalReadinessScore +
      context.monitoringReadinessScore +
      context.rollbackReadinessScore
    ) / 5,
  );

  return {
    activationScore: Math.max(
      0,
      Math.min(100, Math.round(activationScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, confidenceScore),
    ),

    authorizationContribution: Math.round(
      authorizationContribution,
    ),
    executionReadinessContribution: Math.round(
      executionReadinessContribution,
    ),
    resourceReadinessContribution: Math.round(
      resourceReadinessContribution,
    ),
    operationalReadinessContribution: Math.round(
      operationalReadinessContribution,
    ),
    monitoringReadinessContribution: Math.round(
      monitoringReadinessContribution,
    ),
    rollbackReadinessContribution: Math.round(
      rollbackReadinessContribution,
    ),
    gateContribution: Math.round(
      gateContribution,
    ),
    dependencyContribution: Math.round(
      dependencyContribution,
    ),
    checkpointContribution: Math.round(
      checkpointContribution,
    ),
  };
}
