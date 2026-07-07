import { ReportingFormat } from "./reportingTypes";

export interface ReportingTemplate {
  id: string;
  name: string;
  format: ReportingFormat;
  sections: string[];
  metadata?: Record<string, unknown>;
}

export function isReportingTemplateCompatible(
  template: ReportingTemplate,
  format: ReportingFormat,
): boolean {
  return template.format === format;
}
