import {
  buildExecutiveDemoIntelligenceMetrics,
  type ExecutiveDemoIntelligenceMetrics,
} from "./executiveDemoIntelligenceMetrics";
import {
  buildExecutiveDemoIntelligenceReport,
  type ExecutiveDemoIntelligenceReport,
} from "./executiveDemoIntelligenceReport";
import {
  createExecutiveDemoIntelligenceSnapshot,
  type ExecutiveDemoIntelligenceSnapshot,
} from "./executiveDemoIntelligenceSnapshot";
import {
  runExecutiveDemoIntelligence,
  type ExecutiveDemoIntelligenceServiceResult,
} from "./executiveDemoIntelligenceService";
import type {
  ExecutiveDemoIntelligenceAdapterInput,
} from "./executiveDemoIntelligenceAdapter";

export interface ExecutiveDemoIntelligenceOrchestrationResult {
  intelligence: ExecutiveDemoIntelligenceServiceResult;
  metrics: ExecutiveDemoIntelligenceMetrics;
  report: ExecutiveDemoIntelligenceReport;
  snapshot: ExecutiveDemoIntelligenceSnapshot;
}

export class ExecutiveDemoIntelligenceOrchestrator {
  execute(
    input: ExecutiveDemoIntelligenceAdapterInput,
  ): ExecutiveDemoIntelligenceOrchestrationResult {
    const intelligence = runExecutiveDemoIntelligence(input);

    const metrics = buildExecutiveDemoIntelligenceMetrics({
      signals: intelligence.result.insights.flatMap(
        (insight) =>
          insight.supportingSignalIds.map((signalId) => ({
            id: signalId,
            type: "execution" as const,
            title: insight.title,
            description: insight.summary,
            score: 0,
            priority: insight.priority,
            source: "executive-demo-intelligence-insight",
            detectedAt: intelligence.result.generatedAt,
            evidence: [],
          })),
      ),
      insights: intelligence.result.insights,
      actions: intelligence.actions,
      decision: intelligence.decision,
    });

    const report = buildExecutiveDemoIntelligenceReport({
      companyName: input.companyName,
      result: intelligence.result,
      decision: intelligence.decision,
      actions: intelligence.actions,
      narrative: intelligence.narrative,
      metrics,
    });

    const snapshot = createExecutiveDemoIntelligenceSnapshot({
      result: intelligence.result,
      decision: intelligence.decision,
      actions: intelligence.actions,
      narrative: intelligence.narrative,
      metrics,
    });

    return {
      intelligence,
      metrics,
      report,
      snapshot,
    };
  }
}

export function orchestrateExecutiveDemoIntelligence(
  input: ExecutiveDemoIntelligenceAdapterInput,
): ExecutiveDemoIntelligenceOrchestrationResult {
  const orchestrator =
    new ExecutiveDemoIntelligenceOrchestrator();

  return orchestrator.execute(input);
}
