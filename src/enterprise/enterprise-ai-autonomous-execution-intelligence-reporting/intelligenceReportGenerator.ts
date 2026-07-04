import {
  IntelligenceExecutionReport,
  IntelligenceExecutionReportInput,
  IntelligenceReportingRecommendation,
  IntelligenceReportSeverity,
  IntelligenceReportStatus,
} from "./intelligenceReportingTypes";

export class IntelligenceReportGenerator {
  generate(
    input: IntelligenceExecutionReportInput,
  ): IntelligenceExecutionReport {
    const severity = this.calculateSeverity(input);
    const status = this.calculateStatus(severity);

    const recommendations = this.buildRecommendations(severity);

    const confidenceScore =
      input.signals.length === 0
        ? 100
        : Math.round(
            input.signals.reduce((sum, s) => sum + s.confidence, 0) /
              input.signals.length,
          );

    return {
      reportId: `${input.executionId}-${Date.now()}`,
      executionId: input.executionId,
      tenantId: input.tenantId,
      generatedAt: input.generatedAt,
      audience: input.audience,
      status,
      severity,
      executiveSummary: `${input.signals.length} signals and ${input.metrics.length} metrics were analyzed.`,
      keyFindings: input.signals.map((s) => s.title),
      metrics: input.metrics,
      recommendations,
      confidenceScore,
    };
  }

  private calculateSeverity(
    input: IntelligenceExecutionReportInput,
  ): IntelligenceReportSeverity {
    if (input.signals.some((s) => s.severity === "critical")) {
      return "critical";
    }

    if (input.signals.some((s) => s.severity === "high")) {
      return "high";
    }

    if (input.signals.some((s) => s.severity === "medium")) {
      return "medium";
    }

    return "low";
  }

  private calculateStatus(
    severity: IntelligenceReportSeverity,
  ): IntelligenceReportStatus {
    switch (severity) {
      case "critical":
        return "critical";
      case "high":
        return "at_risk";
      case "medium":
        return "attention_required";
      case "low":
      default:
        return "healthy";
    }
  }

  private buildRecommendations(
    severity: IntelligenceReportSeverity,
  ): IntelligenceReportingRecommendation[] {
    return [
      {
        id: "review-execution",
        title: "Review execution health",
        rationale: `Detected ${severity} execution severity.`,
        priority: severity,
        expectedOutcome: "Improve execution quality and reduce operational risk.",
      },
    ];
  }
}