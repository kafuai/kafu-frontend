import {
  IntelligenceReportingMetric,
  IntelligenceReportingSignal,
  IntelligenceReportSeverity,
  IntelligenceReportStatus,
} from "./intelligenceReportingTypes";

export class ReportRiskPriorityClassifier {
  classifySeverity(
    signals: IntelligenceReportingSignal[],
    metrics: IntelligenceReportingMetric[],
  ): IntelligenceReportSeverity {
    if (
      signals.some((signal) => signal.severity === "critical") ||
      metrics.some((metric) => metric.impact === "critical")
    ) {
      return "critical";
    }

    if (
      signals.some((signal) => signal.severity === "high") ||
      metrics.some((metric) => metric.impact === "high")
    ) {
      return "high";
    }

    if (
      signals.some((signal) => signal.severity === "medium") ||
      metrics.some((metric) => metric.impact === "medium")
    ) {
      return "medium";
    }

    return "low";
  }

  classifyStatus(severity: IntelligenceReportSeverity): IntelligenceReportStatus {
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

  rankSignals(
    signals: IntelligenceReportingSignal[],
  ): IntelligenceReportingSignal[] {
    const weight: Record<IntelligenceReportSeverity, number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    };

    return [...signals].sort((a, b) => {
      const severityDiff = weight[b.severity] - weight[a.severity];

      if (severityDiff !== 0) {
        return severityDiff;
      }

      return b.confidence - a.confidence;
    });
  }
}