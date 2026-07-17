import {
  ExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegrationTypes";
import {
  summarizeExecutiveDemoFinalIntegration,
} from "./executiveDemoFinalIntegrationSummary";

export interface ExecutiveDemoFinalIntegrationViewComponent {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
  required: boolean;
}

export interface ExecutiveDemoFinalIntegrationViewCheckpoint {
  id: string;
  title: string;
  description: string;
  status: "passed" | "pending";
  required: boolean;
}

export interface ExecutiveDemoFinalIntegrationViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  readinessLabel: string;
  readinessPercentage: number;
  releaseReady: boolean;
  components: ExecutiveDemoFinalIntegrationViewComponent[];
  checkpoints: ExecutiveDemoFinalIntegrationViewCheckpoint[];
  unresolvedIssues: string[];
  recommendations: string[];
  footerSummary: string;
}

export function buildExecutiveDemoFinalIntegrationViewModel(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegrationViewModel {
  const summary =
    summarizeExecutiveDemoFinalIntegration(integration);

  return {
    id: integration.id,
    companyName: integration.companyName,
    heading: integration.title,
    subheading:
      "Unified executive demo integration and release readiness",
    statusLabel: integration.status.replace(/-/g, " "),
    readinessLabel:
      `${summary.readinessPercentage}% release readiness`,
    readinessPercentage: summary.readinessPercentage,
    releaseReady: summary.releaseReady,
    components: integration.components.map((component) => ({
      id: component.id,
      name: component.name,
      type: component.type.replace(/-/g, " "),
      version: component.version,
      status: component.enabled
        ? component.health
        : "disabled",
      required: component.required,
    })),
    checkpoints: integration.checkpoints.map((checkpoint) => ({
      id: checkpoint.id,
      title: checkpoint.title,
      description: checkpoint.description,
      status: checkpoint.passed ? "passed" : "pending",
      required: checkpoint.required,
    })),
    unresolvedIssues: integration.issues
      .filter((issue) => !issue.resolved)
      .map((issue) => `${issue.title}: ${issue.description}`),
    recommendations: summary.recommendations,
    footerSummary: summary.summary,
  };
}
