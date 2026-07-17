import {
  calculateDemoValidationScore,
  refreshDemoValidationReport,
} from "./demoValidation";
import {
  buildDemoValidationReport,
  DemoValidationBuilderInput,
} from "./demoValidationBuilder";
import {
  DemoValidationReport,
} from "./demoValidationTypes";
import {
  assertDemoValidationReportValid,
} from "./demoValidationValidator";

export class DemoValidationEngine {
  create(
    input: DemoValidationBuilderInput,
  ): DemoValidationReport {
    return buildDemoValidationReport({
      ...input,
      autoRefresh: true,
    });
  }

  refresh(
    report: DemoValidationReport,
  ): DemoValidationReport {
    const refreshed =
      refreshDemoValidationReport(report);

    assertDemoValidationReportValid(refreshed);

    return refreshed;
  }

  recalculate(
    report: DemoValidationReport,
  ): DemoValidationReport {
    const score = calculateDemoValidationScore(
      report.checks,
      report.issues,
    );

    const updated: DemoValidationReport = {
      ...report,
      score,
      status: score.demoReady
        ? "ready"
        : score.criticalIssues > 0
          ? "blocked"
          : "in-progress",
      updatedAt: new Date().toISOString(),
    };

    assertDemoValidationReportValid(updated);

    return updated;
  }

  approve(
    report: DemoValidationReport,
  ): DemoValidationReport {
    const refreshed = this.refresh(report);

    if (!refreshed.score.demoReady) {
      throw new Error(
        "Demo validation cannot be approved before all required checks pass.",
      );
    }

    const timestamp = new Date().toISOString();

    return {
      ...refreshed,
      status: "approved",
      approvedAt: timestamp,
      updatedAt: timestamp,
    };
  }
}
