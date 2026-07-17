import {
  ExecutiveDemoFinalIntegration,
  ExecutiveDemoFinalIntegrationIssue,
} from "./executiveDemoFinalIntegrationTypes";

export interface ExecutiveDemoFinalIntegrationAssessment {
  integrationId: string;
  releaseReady: boolean;
  readinessPercentage: number;
  blockingIssues: ExecutiveDemoFinalIntegrationIssue[];
  recommendations: string[];
  assessmentSummary: string;
}

export function assessExecutiveDemoFinalIntegration(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegrationAssessment {
  const blockingIssues = integration.issues.filter(
    (issue) =>
      !issue.resolved &&
      (issue.severity === "critical" || issue.severity === "high"),
  );

  const recommendations: string[] = [];

  integration.components.forEach((component) => {
    if (component.required && !component.enabled) {
      recommendations.push(
        `Enable required component: ${component.name}.`,
      );
    }

    if (component.required && component.health !== "healthy") {
      recommendations.push(
        `Restore healthy status for component: ${component.name}.`,
      );
    }
  });

  integration.checkpoints.forEach((checkpoint) => {
    if (checkpoint.required && !checkpoint.passed) {
      recommendations.push(
        `Complete required checkpoint: ${checkpoint.title}.`,
      );
    }
  });

  blockingIssues.forEach((issue) => {
    recommendations.push(`Resolve blocking issue: ${issue.title}.`);
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Proceed with executive demo release and final validation.",
    );
  }

  return {
    integrationId: integration.id,
    releaseReady: integration.readiness.releaseReady,
    readinessPercentage:
      integration.readiness.readinessPercentage,
    blockingIssues,
    recommendations,
    assessmentSummary: integration.readiness.releaseReady
      ? "Executive demo final integration is ready for release."
      : `Executive demo final integration is ${integration.readiness.readinessPercentage}% ready and requires additional action.`,
  };
}
