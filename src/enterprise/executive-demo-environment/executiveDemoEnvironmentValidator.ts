import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentValidationIssue,
  ExecutiveDemoEnvironmentValidationResult,
} from "./executiveDemoEnvironmentTypes";

function createIssue(
  field: string,
  message: string,
  severity: "warning" | "error",
): ExecutiveDemoEnvironmentValidationIssue {
  return {
    field,
    message,
    severity,
  };
}

export function validateExecutiveDemoEnvironmentConfiguration(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentValidationResult {
  const issues: ExecutiveDemoEnvironmentValidationIssue[] = [];

  if (!configuration.runtime.environmentId.trim()) {
    issues.push(
      createIssue(
        "runtime.environmentId",
        "Environment ID is required.",
        "error",
      ),
    );
  }

  if (configuration.runtime.sessionTimeoutMinutes <= 0) {
    issues.push(
      createIssue(
        "runtime.sessionTimeoutMinutes",
        "Session timeout must be greater than zero.",
        "error",
      ),
    );
  }

  if (!configuration.branding.organizationName.trim()) {
    issues.push(
      createIssue(
        "branding.organizationName",
        "Organization name is required.",
        "error",
      ),
    );
  }

  if (!configuration.branding.productName.trim()) {
    issues.push(
      createIssue(
        "branding.productName",
        "Product name is required.",
        "error",
      ),
    );
  }

  if (!configuration.branding.primaryLocale.trim()) {
    issues.push(
      createIssue(
        "branding.primaryLocale",
        "Primary locale is required.",
        "error",
      ),
    );
  }

  if (
    !configuration.branding.supportedLocales.includes(
      configuration.branding.primaryLocale,
    )
  ) {
    issues.push(
      createIssue(
        "branding.supportedLocales",
        "Supported locales must include the primary locale.",
        "error",
      ),
    );
  }

  if (
    configuration.features.enableLiveData &&
    configuration.runtime.dataMode === "synthetic"
  ) {
    issues.push(
      createIssue(
        "features.enableLiveData",
        "Live data is enabled while the environment data mode is synthetic.",
        "warning",
      ),
    );
  }

  if (
    configuration.runtime.status === "unavailable" &&
    !configuration.features.enableSyntheticFallback
  ) {
    issues.push(
      createIssue(
        "features.enableSyntheticFallback",
        "Synthetic fallback should be enabled when the environment is unavailable.",
        "warning",
      ),
    );
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}
