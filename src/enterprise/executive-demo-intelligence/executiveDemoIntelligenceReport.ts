import type {
  ExecutiveDemoIntelligenceAction,
} from "./executiveDemoIntelligenceActions";
import type {
  ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import type {
  ExecutiveDemoIntelligenceMetrics,
} from "./executiveDemoIntelligenceMetrics";
import type {
  ExecutiveDemoIntelligenceNarrative,
} from "./executiveDemoIntelligenceNarrative";
import type {
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceReport {
  title: string;
  executiveSummary: string;
  decisionSummary: string;
  recommendedActions: string[];
  narrativeSections: string[];
  metrics: ExecutiveDemoIntelligenceMetrics;
  generatedAt: string;
}

export interface BuildExecutiveDemoIntelligenceReportInput {
  companyName: string;
  result: ExecutiveDemoIntelligenceResult;
  decision: ExecutiveDemoIntelligenceDecision;
  actions: ExecutiveDemoIntelligenceAction[];
  narrative: ExecutiveDemoIntelligenceNarrative;
  metrics: ExecutiveDemoIntelligenceMetrics;
}

export function buildExecutiveDemoIntelligenceReport(
  input: BuildExecutiveDemoIntelligenceReportInput,
): ExecutiveDemoIntelligenceReport {
  return {
    title: `${input.companyName} Executive Demo Intelligence Report`,
    executiveSummary: input.result.executiveSummary,
    decisionSummary: [
      input.decision.title,
      input.decision.summary,
      `Recommended action: ${input.decision.recommendedAction}`,
    ].join(" "),
    recommendedActions: input.actions.map(
      (action) =>
        `${action.title}: ${action.description} Owner: ${action.ownerRole}.`,
    ),
    narrativeSections: [
      input.narrative.opening,
      input.narrative.situation,
      input.narrative.finding,
      input.narrative.decision,
      input.narrative.action,
      input.narrative.closing,
    ],
    metrics: input.metrics,
    generatedAt: input.result.generatedAt,
  };
}

export function formatExecutiveDemoIntelligenceReport(
  report: ExecutiveDemoIntelligenceReport,
): string {
  return [
    report.title,
    report.executiveSummary,
    report.decisionSummary,
    ...report.recommendedActions,
    ...report.narrativeSections,
    `Execution readiness score: ${report.metrics.executionReadinessScore}.`,
    `Generated at: ${report.generatedAt}.`,
  ].join("\n\n");
}
