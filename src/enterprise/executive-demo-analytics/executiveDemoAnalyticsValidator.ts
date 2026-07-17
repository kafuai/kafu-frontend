import type {
  ExecutiveDemoAnalyticsInput,
  ExecutiveDemoAnalyticsSnapshot,
} from "./executiveDemoAnalyticsTypes";

export interface ExecutiveDemoAnalyticsValidationResult {
  valid: boolean;
  errors: string[];
}

function isNonNegativeNumber(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function validateExecutiveDemoAnalyticsInput(
  input: ExecutiveDemoAnalyticsInput,
): ExecutiveDemoAnalyticsValidationResult {
  const errors: string[] = [];

  if (!input.organizationId.trim()) {
    errors.push("organizationId is required.");
  }

  if (!input.sessionId.trim()) {
    errors.push("sessionId is required.");
  }

  const nonNegativeFields: Array<[string, number]> = [
    ["totalDemoSteps", input.totalDemoSteps],
    ["completedDemoSteps", input.completedDemoSteps],
    ["totalInsights", input.totalInsights],
    ["highPriorityInsights", input.highPriorityInsights],
    ["totalRecommendations", input.totalRecommendations],
    ["acceptedRecommendations", input.acceptedRecommendations],
  ];

  for (const [field, value] of nonNegativeFields) {
    if (!isNonNegativeNumber(value)) {
      errors.push(`${field} must be a non-negative number.`);
    }
  }

  if (input.completedDemoSteps > input.totalDemoSteps) {
    errors.push(
      "completedDemoSteps cannot exceed totalDemoSteps.",
    );
  }

  if (input.highPriorityInsights > input.totalInsights) {
    errors.push(
      "highPriorityInsights cannot exceed totalInsights.",
    );
  }

  if (
    input.acceptedRecommendations >
    input.totalRecommendations
  ) {
    errors.push(
      "acceptedRecommendations cannot exceed totalRecommendations.",
    );
  }

  if (
    input.executiveReadinessScore < 0 ||
    input.executiveReadinessScore > 100
  ) {
    errors.push(
      "executiveReadinessScore must be between 0 and 100.",
    );
  }

  if (
    input.intelligenceConfidenceScore < 0 ||
    input.intelligenceConfidenceScore > 100
  ) {
    errors.push(
      "intelligenceConfidenceScore must be between 0 and 100.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateExecutiveDemoAnalyticsSnapshot(
  snapshot: ExecutiveDemoAnalyticsSnapshot,
): ExecutiveDemoAnalyticsValidationResult {
  const errors: string[] = [];

  if (!snapshot.organizationId.trim()) {
    errors.push("Snapshot organizationId is required.");
  }

  if (!snapshot.sessionId.trim()) {
    errors.push("Snapshot sessionId is required.");
  }

  if (Number.isNaN(Date.parse(snapshot.generatedAt))) {
    errors.push("Snapshot generatedAt must be a valid ISO date.");
  }

  if (snapshot.metrics.length === 0) {
    errors.push("Snapshot must contain at least one metric.");
  }

  const metricIds = new Set<string>();

  for (const metric of snapshot.metrics) {
    if (!metric.id.trim()) {
      errors.push("Every analytics metric must have an id.");
    }

    if (metricIds.has(metric.id)) {
      errors.push(`Duplicate analytics metric id: ${metric.id}.`);
    }

    metricIds.add(metric.id);

    if (!Number.isFinite(metric.value)) {
      errors.push(
        `Metric ${metric.id} must contain a finite numeric value.`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
