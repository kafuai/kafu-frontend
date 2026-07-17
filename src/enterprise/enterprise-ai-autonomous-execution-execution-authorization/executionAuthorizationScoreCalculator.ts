import { ExecutionAuthorizationContext } from "./executionAuthorizationContext";

export interface ExecutionAuthorizationScoreCalculation {
  authorizationScore: number;
  confidenceScore: number;

  strategicAlignmentContribution: number;
  executiveApprovalContribution: number;
  executionReadinessContribution: number;
  complianceContribution: number;
  controlContribution: number;
  dependencyContribution: number;
  conditionContribution: number;
}

function percentage(
  passed: number,
  total: number,
): number {
  if (total === 0) {
    return 100;
  }

  return Math.round((passed / total) * 100);
}

export function calculateExecutionAuthorizationScore(
  context: ExecutionAuthorizationContext,
): ExecutionAuthorizationScoreCalculation {
  const strategicAlignmentContribution =
    context.strategicAlignmentScore * 0.20;

  const executiveApprovalContribution =
    (context.executiveApprovalGranted ? 100 : 0) * 0.20;

  const executionReadinessContribution =
    context.executionReadinessScore * 0.20;

  const complianceContribution =
    context.complianceScore * 0.15;

  const passedControls =
    context.controls.filter(
      (control) =>
        !control.required || control.passed,
    ).length;

  const controlScore = percentage(
    passedControls,
    context.controls.length,
  );

  const controlContribution =
    controlScore * 0.15;

  const resolvedDependencies =
    context.dependencies.filter(
      (dependency) => dependency.resolved,
    ).length;

  const dependencyScore = percentage(
    resolvedDependencies,
    context.dependencies.length,
  );

  const dependencyContribution =
    dependencyScore * 0.05;

  const satisfiedConditions =
    context.conditions.filter(
      (condition) => condition.satisfied,
    ).length;

  const conditionScore = percentage(
    satisfiedConditions,
    context.conditions.length,
  );

  const conditionContribution =
    conditionScore * 0.05;

  let authorizationScore =
    strategicAlignmentContribution +
    executiveApprovalContribution +
    executionReadinessContribution +
    complianceContribution +
    controlContribution +
    dependencyContribution +
    conditionContribution;

  const blockingControls =
    context.controls.filter(
      (control) =>
        control.required &&
        !control.passed,
    ).length;

  authorizationScore -= Math.min(
    25,
    blockingControls * 8,
  );

  const blockingDependencies =
    context.dependencies.filter(
      (dependency) =>
        dependency.blocking &&
        !dependency.resolved,
    ).length;

  authorizationScore -= Math.min(
    20,
    blockingDependencies * 10,
  );

  const blockingConditions =
    context.conditions.filter(
      (condition) =>
        condition.blocking &&
        !condition.satisfied,
    ).length;

  authorizationScore -= Math.min(
    20,
    blockingConditions * 10,
  );

  const confidenceScore = Math.round(
    (
      context.executionReadinessScore +
      context.complianceScore +
      context.controlEffectivenessScore +
      context.dependencyReadinessScore
    ) / 4,
  );

  return {
    authorizationScore: Math.max(
      0,
      Math.min(100, Math.round(authorizationScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, confidenceScore),
    ),

    strategicAlignmentContribution: Math.round(
      strategicAlignmentContribution,
    ),
    executiveApprovalContribution: Math.round(
      executiveApprovalContribution,
    ),
    executionReadinessContribution: Math.round(
      executionReadinessContribution,
    ),
    complianceContribution: Math.round(
      complianceContribution,
    ),
    controlContribution: Math.round(
      controlContribution,
    ),
    dependencyContribution: Math.round(
      dependencyContribution,
    ),
    conditionContribution: Math.round(
      conditionContribution,
    ),
  };
}
