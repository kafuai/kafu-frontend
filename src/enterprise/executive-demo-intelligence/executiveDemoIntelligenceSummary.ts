import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligenceSignal,
} from "./executiveDemoIntelligenceTypes";

export interface BuildExecutiveDemoIntelligenceSummaryInput {
  context: ExecutiveDemoIntelligenceContext;
  insights: ExecutiveDemoIntelligenceInsight[];
  signals: ExecutiveDemoIntelligenceSignal[];
  confidence: ExecutiveDemoIntelligenceConfidence;
}

export function buildExecutiveDemoIntelligenceSummary(
  input: BuildExecutiveDemoIntelligenceSummaryInput,
): string {
  const primaryInsight = input.insights[0];
  const criticalSignals = input.signals.filter(
    (signal) => signal.priority === "critical",
  ).length;
  const highPrioritySignals = input.signals.filter(
    (signal) => signal.priority === "high",
  ).length;

  const organizationSummary =
    `${input.context.companyName} is currently at ` +
    `${input.context.currentStage ?? "an active executive evaluation stage"}.`;

  const intelligenceSummary = primaryInsight
    ? `The primary intelligence finding is "${primaryInsight.title}": ${primaryInsight.summary}`
    : "No dominant intelligence finding was identified from the available evidence.";

  const riskSummary =
    criticalSignals > 0
      ? `${criticalSignals} critical signal${criticalSignals === 1 ? "" : "s"} require immediate executive attention.`
      : highPrioritySignals > 0
        ? `${highPrioritySignals} high-priority signal${highPrioritySignals === 1 ? "" : "s"} should be addressed in the next executive action.`
        : "No immediate critical enterprise risk was detected.";

  return [
    organizationSummary,
    intelligenceSummary,
    riskSummary,
    `Overall intelligence confidence is ${input.confidence}.`,
  ].join(" ");
}
