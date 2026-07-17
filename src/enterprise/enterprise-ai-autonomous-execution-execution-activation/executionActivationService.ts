import {
  createExecutionActivationContext,
  CreateExecutionActivationContextInput,
  ExecutionActivationContext,
} from "./executionActivationContext";
import {
  calculateExecutionActivationScore,
  ExecutionActivationScoreCalculation,
} from "./executionActivationScoreCalculator";
import {
  validateExecutionActivation,
  ExecutionActivationValidation,
} from "./executionActivationValidationEngine";
import {
  buildExecutionActivationRecommendation,
  ExecutionActivationRecommendation,
} from "./executionActivationRecommendationEngine";
import {
  buildExecutionActivationNarrative,
  ExecutionActivationNarrative,
} from "./executionActivationNarrativeBuilder";
import {
  createExecutionActivationResult,
  ExecutionActivationResult,
} from "./executionActivationResult";

export interface ExecutionActivationServiceOutput {
  context: ExecutionActivationContext;
  scoreCalculation: ExecutionActivationScoreCalculation;
  validation: ExecutionActivationValidation;
  recommendation: ExecutionActivationRecommendation;
  narrative: ExecutionActivationNarrative;
  result: ExecutionActivationResult;
}

export function evaluateExecutionActivation(
  input: CreateExecutionActivationContextInput,
): ExecutionActivationServiceOutput {
  const context =
    createExecutionActivationContext(input);

  const scoreCalculation =
    calculateExecutionActivationScore(context);

  const validation =
    validateExecutionActivation(
      context,
      scoreCalculation,
    );

  const recommendation =
    buildExecutionActivationRecommendation(
      context,
      scoreCalculation,
      validation,
    );

  const narrative =
    buildExecutionActivationNarrative(
      context,
      scoreCalculation,
      validation,
      recommendation,
    );

  const activatedAt =
    recommendation.activated
      ? context.evaluatedAt
      : null;

  const result = createExecutionActivationResult({
    organizationId: context.organizationId,
    activationRequestId:
      context.activationRequestId,
    executionId: context.executionId,
    authorizationRequestId:
      context.authorizationRequestId,

    activationScore:
      scoreCalculation.activationScore,
    confidenceScore:
      scoreCalculation.confidenceScore,

    status: recommendation.status,
    activated: recommendation.activated,

    passedGates:
      context.gates.filter(
        (gate) => gate.passed,
      ),

    failedGates:
      context.gates.filter(
        (gate) => !gate.passed,
      ),

    completedCheckpoints:
      context.checkpoints.filter(
        (checkpoint) => checkpoint.completed,
      ),

    incompleteCheckpoints:
      context.checkpoints.filter(
        (checkpoint) => !checkpoint.completed,
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

    activationMode: context.mode,
    activatedAt,

    requiresManualRelease:
      context.requiresManualRelease,

    requiresContinuousMonitoring:
      context.requiresContinuousMonitoring,

    rollbackEnabled:
      context.rollbackEnabled,

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

export class ExecutionActivationIntelligenceService {
  evaluate(
    input: CreateExecutionActivationContextInput,
  ): ExecutionActivationServiceOutput {
    return evaluateExecutionActivation(input);
  }
}
