import { ReportingFormat, ReportingFrequency, ReportingStatus } from "./reportingTypes";

export interface ReportingDefinition {
  id: string;
  name: string;
  description?: string;
  status: ReportingStatus;
  format: ReportingFormat;
  frequency: ReportingFrequency;
  dataSourceIds: string[];
  metricIds: string[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export function createReportingDefinition(input: ReportingDefinition): ReportingDefinition {
  return {
    ...input,
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}
