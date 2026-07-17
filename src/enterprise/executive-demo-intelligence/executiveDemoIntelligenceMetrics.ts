import type {
  ExecutiveDemoIntelligenceAction,
} from "./executiveDemoIntelligenceActions";
import type {
  ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligencePriority,
  ExecutiveDemoIntelligenceSignal,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceMetrics {
  signalsCount: number;
  insightsCount: number;
  actionsCount: number;
  criticalSignalsCount: number;
  highPriorityInsightsCount: number;
  readyActionsCount: number;
  confidence: ExecutiveDemoIntelligenceConfidence;
  decisionPriority: ExecutiveDemoIntelligencePriority;
  executionReadinessScore: number;
}

export interface BuildExecutiveDemoIntelligenceMetricsInput {
  signals: ExecutiveDemoIntelligenceSignal[];
  insights: ExecutiveDemoIntelligenceInsight[];
  actions: ExecutiveDemoIntelligenceAction[];
  decision: ExecutiveDemoIntelligenceDecision;
}

export function buildExecutiveDemoIntelligenceMetrics(
  input: BuildExecutiveDemoIntelligenceMetricsInput,
): ExecutiveDemoIntelligenceMetrics {
  const criticalSignalsCount = input.signals.filter(
    (signal) => signal.priority === "critical",
  ).length;

  const highPriorityInsightsCount = input.insights.filter(
    (insight) =>
      insight.priority === "critical" ||
      insight.priority === "high",
  ).length;

  const readyActionsCount = input.actions.filter(
    (action) => action.status === "ready",
  ).length;

  return {
    signalsCount: input.signals.length,
    insightsCount: input.insights.length,
    actionsCount: input.actions.length,
    criticalSignalsCount,
    highPriorityInsightsCount,
    readyActionsCount,
    confidence: input.decision.confidence,
    decisionPriority: input.decision.priority,
    executionReadinessScore: calculateExecutionReadinessScore(
      input.actions,
      input.decision.confidence,
    ),
  };
}

function calculateExecutionReadinessScore(
  actions: ExecutiveDemoIntelligenceAction[],
  confidence: ExecutiveDemoIntelligenceConfidence,
): number {
  if (actions.length === 0) {
    return 0;
  }

  const readyActions = actions.filter(
    (action) => action.status === "ready",
  ).length;

  const recommendedActions = actions.filter(
    (action) => action.status === "recommended",
  ).length;

  const blockedActions = actions.filter(
    (action) => action.status === "blocked",
  ).length;

  const actionScore =
    ((readyActions * 100 +
      recommendedActions * 70 +
      blockedActions * 20) /
      actions.length);

  const confidenceMultiplier: Record<
    ExecutiveDemoIntelligenceConfidence,
    number
  > = {
    high: 1,
    medium: 0.85,
    low: 0.65,
  };

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        actionScore * confidenceMultiplier[confidence],
      ),
    ),
  );
}
