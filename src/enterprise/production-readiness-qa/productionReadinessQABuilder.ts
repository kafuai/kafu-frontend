import {
  createProductionReadinessQAReport,
  refreshProductionReadinessQAReport,
} from "./productionReadinessQA";
import {
  buildProductionReadinessQAReportInput,
  ProductionReadinessQAContext,
} from "./productionReadinessQAContext";
import {
  ProductionReadinessQAIssue,
  ProductionReadinessQAReport,
} from "./productionReadinessQATypes";
import {
  assertProductionReadinessQAReportValid,
} from "./productionReadinessQAValidator";

export interface ProductionReadinessQABuilderInput {
  context: ProductionReadinessQAContext;
  title?: string;
  issues?: ProductionReadinessQAIssue[];
  autoRefresh?: boolean;
}

export function buildProductionReadinessQA(
  input: ProductionReadinessQABuilderInput,
): ProductionReadinessQAReport {
  const reportInput = buildProductionReadinessQAReportInput(
    input.context,
  );

  reportInput.title =
    input.title?.trim() ?? reportInput.title;

  reportInput.issues = input.issues ?? [];

  const report = createProductionReadinessQAReport(
    reportInput,
  );

  const finalizedReport =
    input.autoRefresh ?? true
      ? refreshProductionReadinessQAReport(report)
      : report;

  assertProductionReadinessQAReportValid(finalizedReport);

  return finalizedReport;
}
