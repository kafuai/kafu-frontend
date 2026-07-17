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

export interface ExecutiveDemoIntelligenceSnapshot {
  id: string;
  sessionId: string;
  organizationId: string;
  result: ExecutiveDemoIntelligenceResult;
  decision: ExecutiveDemoIntelligenceDecision;
  actions: ExecutiveDemoIntelligenceAction[];
  narrative: ExecutiveDemoIntelligenceNarrative;
  metrics: ExecutiveDemoIntelligenceMetrics;
  createdAt: string;
}

export interface CreateExecutiveDemoIntelligenceSnapshotInput {
  result: ExecutiveDemoIntelligenceResult;
  decision: ExecutiveDemoIntelligenceDecision;
  actions: ExecutiveDemoIntelligenceAction[];
  narrative: ExecutiveDemoIntelligenceNarrative;
  metrics: ExecutiveDemoIntelligenceMetrics;
  createdAt?: string;
}

export function createExecutiveDemoIntelligenceSnapshot(
  input: CreateExecutiveDemoIntelligenceSnapshotInput,
): ExecutiveDemoIntelligenceSnapshot {
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    id: `${input.result.sessionId}-intelligence-snapshot-${createdAt}`,
    sessionId: input.result.sessionId,
    organizationId: input.result.organizationId,
    result: input.result,
    decision: input.decision,
    actions: [...input.actions],
    narrative: input.narrative,
    metrics: input.metrics,
    createdAt,
  };
}

export function compareExecutiveDemoIntelligenceSnapshots(
  current: ExecutiveDemoIntelligenceSnapshot,
  previous?: ExecutiveDemoIntelligenceSnapshot,
): {
  executionReadinessChange: number;
  signalsChange: number;
  insightsChange: number;
  actionsChange: number;
} {
  if (!previous) {
    return {
      executionReadinessChange:
        current.metrics.executionReadinessScore,
      signalsChange: current.metrics.signalsCount,
      insightsChange: current.metrics.insightsCount,
      actionsChange: current.metrics.actionsCount,
    };
  }

  return {
    executionReadinessChange:
      current.metrics.executionReadinessScore -
      previous.metrics.executionReadinessScore,
    signalsChange:
      current.metrics.signalsCount -
      previous.metrics.signalsCount,
    insightsChange:
      current.metrics.insightsCount -
      previous.metrics.insightsCount,
    actionsChange:
      current.metrics.actionsCount -
      previous.metrics.actionsCount,
  };
}
