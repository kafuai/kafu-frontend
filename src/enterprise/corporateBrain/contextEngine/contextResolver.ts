import { ContextState } from "./contextState";
import { ContextSignal } from "./contextSignal";

export interface ContextResolutionResult {
  state: ContextState;
  activeSignalIds: string[];
  confidence: number;
}

export function resolveContext(
  state: ContextState,
): ContextResolutionResult {
  const activeSignals = state.signals.filter((signal) => signal.weight > 0);

  const confidence =
    activeSignals.length === 0
      ? 0
      : activeSignals.reduce((sum, signal) => sum + signal.weight, 0) /
        activeSignals.length;

  return {
    state: {
      ...state,
      resolvedAt: new Date().toISOString(),
    },
    activeSignalIds: activeSignals.map((signal) => signal.id),
    confidence: Number(confidence.toFixed(2)),
  };
}