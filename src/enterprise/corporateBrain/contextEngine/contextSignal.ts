export type ContextSignalType =
  | "query"
  | "behavior"
  | "event"
  | "document"
  | "workflow"
  | "interaction";

export interface ContextSignal {
  id: string;
  tenantId: string;
  type: ContextSignalType;
  sourceId: string;
  value: string;
  weight: number;
  timestamp: string;
}

export function normalizeContextSignal(
  signal: ContextSignal,
): ContextSignal {
  return {
    ...signal,
    weight: Math.max(0, Math.min(1, signal.weight)),
  };
}