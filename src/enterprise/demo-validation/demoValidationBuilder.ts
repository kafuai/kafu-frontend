import {
  createDemoValidationReport,
  refreshDemoValidationReport,
} from "./demoValidation";
import {
  buildDemoValidationReportInput,
  DemoValidationContext,
} from "./demoValidationContext";
import {
  DemoValidationIssue,
  DemoValidationReport,
} from "./demoValidationTypes";
import {
  assertDemoValidationReportValid,
} from "./demoValidationValidator";

export interface DemoValidationBuilderInput {
  context: DemoValidationContext;
  title?: string;
  issues?: DemoValidationIssue[];
  autoRefresh?: boolean;
}

export function buildDemoValidationReport(
  input: DemoValidationBuilderInput,
): DemoValidationReport {
  const reportInput = buildDemoValidationReportInput(
    input.context,
  );

  reportInput.title =
    input.title?.trim() ?? reportInput.title;

  reportInput.issues = input.issues ?? [];

  const report = createDemoValidationReport(reportInput);

  const finalizedReport =
    input.autoRefresh ?? true
      ? refreshDemoValidationReport(report)
      : report;

  assertDemoValidationReportValid(finalizedReport);

  return finalizedReport;
}
