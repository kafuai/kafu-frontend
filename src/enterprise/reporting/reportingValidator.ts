import { ReportingDefinition } from "./reportingDefinition";

export interface ReportingValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateReportingDefinition(
  definition: ReportingDefinition,
): ReportingValidationResult {
  const errors: string[] = [];

  if (!definition.id) errors.push("Missing report id.");
  if (!definition.name) errors.push("Missing report name.");
  if (definition.dataSourceIds.length === 0)
    errors.push("At least one data source is required.");
  if (definition.metricIds.length === 0)
    errors.push("At least one metric is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}
