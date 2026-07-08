import type { EnterpriseProcess } from "./processExcellenceTypes";
import { enterpriseProcessCatalog } from "./processCatalog";
import { buildProcessExcellenceSummary } from "./processDashboard";
import { calculatePortfolioKpiScore } from "./processKpi";
import { generateImprovementOpportunities } from "./processImprovement";
import { detectProcessRisks } from "./processRisk";
import { recommendProcessAutomation } from "./processAutomation";
import { getGovernanceDecisions } from "./processGovernance";

export function runProcessExcellenceAssessment(
  processes: EnterpriseProcess[] = enterpriseProcessCatalog
) {
  return {
    summary: buildProcessExcellenceSummary(processes),
    portfolioKpiScore: calculatePortfolioKpiScore(processes),
    improvementOpportunities: generateImprovementOpportunities(processes),
    riskSignals: detectProcessRisks(processes),
    automationRecommendations: recommendProcessAutomation(processes),
    governanceDecisions: getGovernanceDecisions(processes),
  };
}
