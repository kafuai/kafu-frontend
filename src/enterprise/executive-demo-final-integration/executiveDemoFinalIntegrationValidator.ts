import {
  ExecutiveDemoFinalIntegration,
  ExecutiveDemoFinalIntegrationComponent,
} from "./executiveDemoFinalIntegrationTypes";

export interface ExecutiveDemoFinalIntegrationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function hasDuplicateComponentIds(
  components: ExecutiveDemoFinalIntegrationComponent[],
): boolean {
  return new Set(components.map((component) => component.id)).size !==
    components.length;
}

export function validateExecutiveDemoFinalIntegration(
  integration: ExecutiveDemoFinalIntegration,
): ExecutiveDemoFinalIntegrationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!integration.organizationId.trim()) {
    errors.push("Organization ID is required.");
  }

  if (!integration.companyName.trim()) {
    errors.push("Company name is required.");
  }

  if (!integration.title.trim()) {
    errors.push("Final integration title is required.");
  }

  if (integration.components.length === 0) {
    errors.push("At least one integration component is required.");
  }

  if (hasDuplicateComponentIds(integration.components)) {
    errors.push("Integration component IDs must be unique.");
  }

  integration.components.forEach((component) => {
    if (!component.id.trim()) {
      errors.push("Every integration component requires an ID.");
    }

    if (!component.name.trim()) {
      errors.push(
        `Integration component ${component.id || "unknown"} requires a name.`,
      );
    }

    if (
      component.required &&
      (!component.enabled || component.health !== "healthy")
    ) {
      warnings.push(
        `Required component ${component.name} is not fully ready.`,
      );
    }
  });

  if (
    integration.readiness.readinessPercentage < 0 ||
    integration.readiness.readinessPercentage > 100
  ) {
    errors.push("Readiness percentage must be between 0 and 100.");
  }

  if (
    integration.status === "released" &&
    !integration.readiness.releaseReady
  ) {
    errors.push(
      "A released final integration must be fully release-ready.",
    );
  }

  if (integration.checkpoints.length === 0) {
    warnings.push("No final integration checkpoints are defined.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertExecutiveDemoFinalIntegrationValid(
  integration: ExecutiveDemoFinalIntegration,
): void {
  const result = validateExecutiveDemoFinalIntegration(integration);

  if (!result.valid) {
    throw new Error(
      `Invalid executive demo final integration: ${result.errors.join(" ")}`,
    );
  }
}
