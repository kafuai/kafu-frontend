import {
  ExecutiveDemoFinalIntegration,
  ExecutiveDemoFinalIntegrationInput,
  ExecutiveDemoFinalIntegrationReadiness,
} from "./executiveDemoFinalIntegrationTypes";

function createIntegrationId(organizationId: string): string {
  const normalizedOrganizationId = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `executive-demo-final-integration-${
    normalizedOrganizationId || "organization"
  }-${Date.now()}`;
}

export function calculateExecutiveDemoFinalIntegrationReadiness(
  integration: Pick<
    ExecutiveDemoFinalIntegration,
    "components" | "issues" | "checkpoints"
  >,
): ExecutiveDemoFinalIntegrationReadiness {
  const requiredComponents = integration.components.filter(
    (component) => component.required,
  );

  const readyRequiredComponents = requiredComponents.filter(
    (component) =>
      component.enabled && component.health === "healthy",
  );

  const healthyComponents = integration.components.filter(
    (component) =>
      component.enabled && component.health === "healthy",
  ).length;

  const unresolvedIssues = integration.issues.filter(
    (issue) => !issue.resolved,
  ).length;

  const requiredCheckpoints = integration.checkpoints.filter(
    (checkpoint) => checkpoint.required,
  );

  const passedCheckpoints = integration.checkpoints.filter(
    (checkpoint) => checkpoint.passed,
  ).length;

  const componentScore =
    requiredComponents.length === 0
      ? 100
      : Math.round(
          (readyRequiredComponents.length / requiredComponents.length) * 100,
        );

  const checkpointScore =
    requiredCheckpoints.length === 0
      ? 100
      : Math.round(
          (
            requiredCheckpoints.filter((checkpoint) => checkpoint.passed)
              .length / requiredCheckpoints.length
          ) * 100,
        );

  const issuePenalty = Math.min(unresolvedIssues * 10, 50);

  const readinessPercentage = Math.max(
    0,
    Math.round((componentScore + checkpointScore) / 2 - issuePenalty),
  );

  const hasBlockingIssue = integration.issues.some(
    (issue) =>
      !issue.resolved &&
      (issue.severity === "critical" || issue.severity === "high"),
  );

  return {
    totalComponents: integration.components.length,
    healthyComponents,
    requiredComponentsReady: readyRequiredComponents.length,
    requiredComponentsTotal: requiredComponents.length,
    unresolvedIssues,
    passedCheckpoints,
    totalCheckpoints: integration.checkpoints.length,
    readinessPercentage,
    releaseReady:
      readinessPercentage === 100 &&
      !hasBlockingIssue &&
      readyRequiredComponents.length === requiredComponents.length,
  };
}

export function createExecutiveDemoFinalIntegration(
  input: ExecutiveDemoFinalIntegrationInput,
): ExecutiveDemoFinalIntegration {
  const timestamp = new Date().toISOString();

  const baseIntegration: ExecutiveDemoFinalIntegration = {
    id: createIntegrationId(input.organizationId),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title:
      input.title?.trim() ||
      `${input.companyName.trim()} Executive Demo Final Integration`,
    status: "draft",
    components: input.components,
    issues: input.issues ?? [],
    checkpoints: input.checkpoints ?? [],
    readiness: {
      totalComponents: 0,
      healthyComponents: 0,
      requiredComponentsReady: 0,
      requiredComponentsTotal: 0,
      unresolvedIssues: 0,
      passedCheckpoints: 0,
      totalCheckpoints: 0,
      readinessPercentage: 0,
      releaseReady: false,
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...baseIntegration,
    readiness:
      calculateExecutiveDemoFinalIntegrationReadiness(baseIntegration),
  };
}

export function markExecutiveDemoFinalIntegrationReady(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegration {
  const timestamp = new Date().toISOString();
  const readiness =
    calculateExecutiveDemoFinalIntegrationReadiness(integration);

  return {
    ...integration,
    status: readiness.releaseReady ? "ready" : "assembling",
    readiness,
    updatedAt: timestamp,
  };
}

export function releaseExecutiveDemoFinalIntegration(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegration {
  const readiness =
    calculateExecutiveDemoFinalIntegrationReadiness(integration);

  if (!readiness.releaseReady) {
    throw new Error(
      "Executive demo final integration is not ready for release.",
    );
  }

  const timestamp = new Date().toISOString();

  return {
    ...integration,
    status: "released",
    readiness,
    releasedAt: timestamp,
    updatedAt: timestamp,
  };
}
