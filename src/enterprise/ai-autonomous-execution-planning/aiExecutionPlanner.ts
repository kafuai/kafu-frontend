import { AIExecutionDependency } from "./aiExecutionDependency";
import { AIExecutionObjective } from "./aiExecutionObjective";
import { createAIExecutionPlan, AIExecutionPlan } from "./aiExecutionPlan";
import {
  createAIExecutionPlanningResult,
  AIExecutionPlanningResult,
} from "./aiExecutionPlanningResult";
import {
  evaluateAIExecutionReadiness,
} from "./aiExecutionReadiness";
import { sequenceAIExecutionStepsByRisk } from "./aiExecutionRiskSequencer";
import { sortAIExecutionSteps } from "./aiExecutionSequence";
import { AIExecutionStep } from "./aiExecutionStep";
import {
  AIExecutionPlanningAuditMetadata,
} from "./aiAutonomousExecutionPlanningTypes";

export interface AIExecutionPlannerInput {
  planId: string;
  objective: AIExecutionObjective;
  steps: AIExecutionStep[];
  dependencies?: AIExecutionDependency[];
  audit: AIExecutionPlanningAuditMetadata;
}

export function createAIExecutionPlanning(
  input: AIExecutionPlannerInput,
): AIExecutionPlanningResult {
  const dependencyOrdered = sortAIExecutionSteps(
    input.steps,
    input.dependencies ?? [],
  );

  const orderedSteps = sequenceAIExecutionStepsByRisk(
    dependencyOrdered,
  );

  const plan: AIExecutionPlan = createAIExecutionPlan({
    id: input.planId,
    objective: input.objective,
    steps: orderedSteps,
    dependencies: input.dependencies,
    audit: input.audit,
  });

  const readiness = evaluateAIExecutionReadiness(
    input.objective,
    orderedSteps,
  );

  return createAIExecutionPlanningResult({
    plan,
    readiness,
    warnings: readiness.missingRequirements,
  });
}