import {
  IntelligenceExecutionReportInput,
  IntelligenceReportSeverity,
} from "./intelligenceReportingTypes";

export class ExecutiveSummaryBuilder {
  build(
    input: IntelligenceExecutionReportInput,
    severity: IntelligenceReportSeverity,
  ): string {
    const signalCount = input.signals.length;
    const metricCount = input.metrics.length;

    const averageConfidence =
      signalCount === 0
        ? 100
        : Math.round(
            input.signals.reduce((sum, signal) => sum + signal.confidence, 0) /
              signalCount,
          );

    return [
      `Execution intelligence report for tenant ${input.tenantId}.`,
      `${signalCount} execution signals and ${metricCount} operational metrics were evaluated.`,
      `Overall execution severity is '${severity}'.`,
      `Average analytical confidence is ${averageConfidence}%.`,
      "This report is intended to support enterprise operational decision making.",
    ].join(" ");
  }
}