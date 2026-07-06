import { EnterpriseAIPlanningEngineResult } from "./enterpriseAIPlanningEngine";

export interface EnterpriseAIPlanningReport {
  planningId: string;
  title: string;
  status: string;
  confidenceScore: number;
  totalSteps: number;
  alternativePlans: number;
  riskScore: number;
}

export function createEnterpriseAIPlanningReport(
  result: EnterpriseAIPlanningEngineResult
): EnterpriseAIPlanningReport {
  return {
    planningId: result.primaryPlan.id,
    title: result.primaryPlan.title,
    status: result.primaryPlan.status,
    confidenceScore: result.primaryPlan.confidenceScore,
    totalSteps: result.primaryPlan.steps.length,
    alternativePlans: result.alternativePlans.length,
    riskScore: result.riskScore,
  };
}