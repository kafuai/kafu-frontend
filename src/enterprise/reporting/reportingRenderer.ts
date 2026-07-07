import { ReportingFormat } from "./reportingTypes";

export interface ReportingRenderInput<T = unknown> {
  reportId: string;
  format: ReportingFormat;
  data: T;
}

export interface ReportingRenderedOutput {
  reportId: string;
  format: ReportingFormat;
  content: string;
  renderedAt: string;
}

export function renderReportingOutput<T>(input: ReportingRenderInput<T>): ReportingRenderedOutput {
  return {
    reportId: input.reportId,
    format: input.format,
    content: JSON.stringify(input.data, null, 2),
    renderedAt: new Date().toISOString(),
  };
}
