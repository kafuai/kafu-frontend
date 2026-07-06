import { EnterpriseAIPlanningEngineInput } from "./enterpriseAIPlanningEngineInput";
import { EnterpriseAIPlan } from "./enterpriseAIPlanningEngineTypes";
import { generateAlternativeEnterprisePlans } from "./enterprisePlanningAlternativeGenerator";
import { optimizeEnterprisePlan } from "./enterprisePlanningOptimizer";
import { resolveEnterprisePlanningDependencies } from "./enterprisePlanningDependencyResolver";
import { buildEnterprisePlanningTimeline } from "./enterprisePlanningTimeline";
import { calculateEnterprisePlanningRiskScore } from "./enterprisePlanningRiskEvaluator";
import { executeEnterprisePlanningRuntime } from "./enterprisePlanningRuntime";

export interface EnterpriseAIPlanningEngineResult {
  primaryPlan: EnterpriseAIPlan;
  alternativePlans: EnterpriseAIPlan[];
  timeline: ReturnType<typeof buildEnterprisePlanningTimeline>;
  riskScore: number;
}

export function executeEnterpriseAIPlanningEngine(
  input: EnterpriseAIPlanningEngineInput
): EnterpriseAIPlanningEngineResult {
  let plan = executeEnterprisePlanningRuntime(input);

  plan = {
    ...plan,
    steps: resolveEnterprisePlanningDependencies(plan.steps),
  };

  plan = optimizeEnterprisePlan(plan);

  return {
    primaryPlan: plan,
    alternativePlans: generateAlternativeEnterprisePlans(plan),
    timeline: buildEnterprisePlanningTimeline(plan.steps),
    riskScore: calculateEnterprisePlanningRiskScore(plan.risks),
  };
}