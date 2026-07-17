import {
  createExecutionAuthorizationContext,
  CreateExecutionAuthorizationContextInput,
  ExecutionAuthorizationContext,
} from "./executionAuthorizationContext";
import {
  calculateExecutionAuthorizationScore,
  ExecutionAuthorizationScoreCalculation,
} from "./executionAuthorizationScoreCalculator";
import {
  validateExecutionAuthorization,
  ExecutionAuthorizationValidation,
} from "./executionAuthorizationValidationEngine";
import {
  buildExecutionAuthorizationRecommendation,
  ExecutionAuthorizationRecommendation,
} from "./executionAuthorizationRecommendationEngine";
import {
  buildExecutionAuthorizationNarrative,
  ExecutionAuthorizationNarrative,
} from "./executionAuthorizationNarrativeBuilder";
import {
  createExecutionAuthorizationResult,
  ExecutionAuthorizationResult,
} from "./executionAuthorizationResult";

export interface ExecutionAuthorizationServiceOutput {
  context: ExecutionAuthorizationContext;
  scoreCalculation: ExecutionAuthorizationScoreCalculation;
  validation: ExecutionAuthorizationValidation;
  recommendation: ExecutionAuthorizationRecommendation;
  narrative: ExecutionAuthorizationNarrative;
  result: ExecutionAuthorizationResult;
}

export function evaluateExecutionAuthorization(
  input: CreateExecutionAuthorizationContextInput,
): ExecutionAuthorizationServiceOutput {
  const context =
    createExecutionAuthorizationContext(input);

  const scoreCalculation =
    calculateExecutionAuthorizationScore(context);

  const validation =
    validateExecutionAuthorization(
      context,
      scoreCalculation,
    );

  const recommendation =
    buildExecutionAuthorizationRecommendation(
      context,
      scoreCalculation,
      validation,
    );

  const narrative =
    buildExecutionAuthorizationNarrative(
      context,
      scoreCalculation,
      validation,
      recommendation,
    );

  const validFrom =
    context.authorizationWindow?.startsAt ??
    context.evaluatedAt;

  const validUntil =
    context.authorizationWindow?.expiresAt ?? null;

  const result = createExecutionAuthorizationResult({
    organizationId: context.organizationId,
    authorizationRequestId:
      context.authorizationRequestId,
    executionId: context.executionId,
    decisionId: context.decisionId,

    authorizationScore:
      scoreCalculation.authorizationScore,
    confidenceScore:
      scoreCalculation.confidenceScore,

    status: recommendation.status,
    authorized: recommendation.authorized,

    passedControls:
      context.controls.filter(
        (control) => control.passed,
      ),

    failedControls:
      context.controls.filter(
        (control) => !control.passed,
      ),

    satisfiedConditions:
      context.conditions.filter(
        (condition) => condition.satisfied,
      ),

    unsatisfiedConditions:
      context.conditions.filter(
        (condition) => !condition.satisfied,
      ),

    blockingConditions:
      context.conditions.filter(
        (condition) =>
          condition.blocking &&
          !condition.satisfied,
      ),

    resolvedDependencies:
      context.dependencies.filter(
        (dependency) => dependency.resolved,
      ),

    unresolvedDependencies:
      context.dependencies.filter(
        (dependency) => !dependency.resolved,
      ),

    blockingDependencies:
      context.dependencies.filter(
        (dependency) =>
          dependency.blocking &&
          !dependency.resolved,
      ),

    validFrom,
    validUntil,

    requiresContinuousMonitoring:
      context.requiresContinuousMonitoring,

    requiresManualRelease:
      context.requiresManualRelease,

    executiveSummary:
      narrative.summary,

    recommendedAction:
      narrative.executionGuidance,

    evaluatedAt:
      context.evaluatedAt,
  });

  return {
    context,
    scoreCalculation,
    validation,
    recommendation,
    narrative,
    result,
  };
}

export class ExecutionAuthorizationIntelligenceService {
  evaluate(
    input: CreateExecutionAuthorizationContextInput,
  ): ExecutionAuthorizationServiceOutput {
    return evaluateExecutionAuthorization(input);
  }
}
