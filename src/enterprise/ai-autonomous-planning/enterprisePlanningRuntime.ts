import { EnterpriseAIPlanningEngineInput } from "./enterpriseAIPlanningEngineInput";
import {
  EnterpriseAIPlan,
  EnterprisePlanningStatus,
} from "./enterpriseAIPlanningEngineTypes";
import { calculateEnterprisePlanningConfidence } from "./enterprisePlanningConfidence";
import { decomposeEnterprisePlanningGoals } from "./enterprisePlanningGoalDecomposer";

export function executeEnterprisePlanningRuntime(
  input: EnterpriseAIPlanningEngineInput
): EnterpriseAIPlan {
  const steps = decomposeEnterprisePlanningGoals(input.goals);

  const confidence = calculateEnterprisePlanningConfidence({
    steps,
    constraints: input.constraints,
    resources: input.availableResources,
    risks: input.knownRisks,
  });

  const status: EnterprisePlanningStatus =
    confidence >= 0.6 ? "approved" : "evaluating";

  return {
    id: input.planningId,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    status,
    goals: input.goals,
    constraints: input.constraints,
    resources: input.availableResources,
    risks: input.knownRisks,
    steps,
    confidenceScore: confidence,
    createdAt: input.createdAt,
    updatedAt: new Date().toISOString(),
  };
}