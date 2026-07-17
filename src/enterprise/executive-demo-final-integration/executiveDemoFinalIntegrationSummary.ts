import {
  ExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegrationTypes";
import {
  assessExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegrationAssessment";

export interface ExecutiveDemoFinalIntegrationSummary {
  integrationId: string;
  companyName: string;
  title: string;
  status: string;
  readinessPercentage: number;
  releaseReady: boolean;
  totalComponents: number;
  healthyComponents: number;
  requiredComponentsReady: number;
  requiredComponentsTotal: number;
  unresolvedIssues: number;
  passedCheckpoints: number;
  totalCheckpoints: number;
  recommendations: string[];
  summary: string;
}

export function summarizeExecutiveDemoFinalIntegration(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegrationSummary {
  const assessment =
    assessExecutiveDemoFinalIntegration(integration);

  return {
    integrationId: integration.id,
    companyName: integration.companyName,
    title: integration.title,
    status: integration.status,
    readinessPercentage:
      integration.readiness.readinessPercentage,
    releaseReady: integration.readiness.releaseReady,
    totalComponents: integration.readiness.totalComponents,
    healthyComponents: integration.readiness.healthyComponents,
    requiredComponentsReady:
      integration.readiness.requiredComponentsReady,
    requiredComponentsTotal:
      integration.readiness.requiredComponentsTotal,
    unresolvedIssues: integration.readiness.unresolvedIssues,
    passedCheckpoints:
      integration.readiness.passedCheckpoints,
    totalCheckpoints: integration.readiness.totalCheckpoints,
    recommendations: assessment.recommendations,
    summary:
      `${integration.companyName} executive demo final integration is ` +
      `${integration.readiness.readinessPercentage}% ready with ` +
      `${integration.readiness.healthyComponents} healthy components and ` +
      `${integration.readiness.unresolvedIssues} unresolved issues.`,
  };
}
