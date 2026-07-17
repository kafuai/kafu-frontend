import {
  approveProductionReadinessQAReport,
  calculateProductionReadinessQAScore,
  refreshProductionReadinessQAReport,
} from "./productionReadinessQA";
import {
  buildProductionReadinessQA,
} from "./productionReadinessQABuilder";
import {
  ProductionReadinessQAContext,
} from "./productionReadinessQAContext";
import {
  ProductionReadinessQAIssue,
  ProductionReadinessQAReport,
} from "./productionReadinessQATypes";
import {
  assertProductionReadinessQAReportValid,
} from "./productionReadinessQAValidator";

export interface ProductionReadinessQAEngineInput {
  context: ProductionReadinessQAContext;
  title?: string;
  issues?: ProductionReadinessQAIssue[];
}

export class ProductionReadinessQAEngine {
  create(
    input: ProductionReadinessQAEngineInput,
  ): ProductionReadinessQAReport {
    return buildProductionReadinessQA({
      context: input.context,
      title: input.title,
      issues: input.issues,
      autoRefresh: true,
    });
  }

  refresh(
    report: ProductionReadinessQAReport,
  ): ProductionReadinessQAReport {
    const refreshed = refreshProductionReadinessQAReport(
      report,
    );

    assertProductionReadinessQAReportValid(refreshed);

    return refreshed;
  }

  recalculate(
    report: ProductionReadinessQAReport,
  ): ProductionReadinessQAReport {
    const updated: ProductionReadinessQAReport = {
      ...report,
      score: calculateProductionReadinessQAScore(
        report.checks,
        report.issues,
      ),
      updatedAt: new Date().toISOString(),
    };

    assertProductionReadinessQAReportValid(updated);

    return updated;
  }

  approve(
    report: ProductionReadinessQAReport,
  ): ProductionReadinessQAReport {
    const refreshed = this.refresh(report);

    return approveProductionReadinessQAReport(refreshed);
  }
}
