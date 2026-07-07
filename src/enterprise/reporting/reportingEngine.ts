import { ReportingDefinition } from "./reportingDefinition";
import { ReportingResult } from "./reportingTypes";

export function executeReportingEngine<T>(
  definition: ReportingDefinition,
  payload: T,
): ReportingResult<T> {
  return {
    reportId: definition.id,
    status: "success",
    generatedAt: new Date().toISOString(),
    format: definition.format,
    payload,
  };
}
