export type AITraceEventPhase =
  | "received"
  | "validated"
  | "routed"
  | "model_invoked"
  | "response_generated"
  | "post_processed"
  | "completed"
  | "failed";

export interface AITraceEvent {
  id: string;
  organizationId: string;
  traceId: string;
  requestId: string;
  phase: AITraceEventPhase;
  serviceName: string;
  environment: string;
  message: string;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface CreateAITraceEventInput {
  id: string;
  organizationId: string;
  traceId: string;
  requestId: string;
  phase: AITraceEventPhase;
  serviceName: string;
  environment: string;
  message: string;
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, string | number | boolean>;
}

export function createAITraceEvent(
  input: CreateAITraceEventInput,
): AITraceEvent {
  const startedAt = input.startedAt ?? new Date();
  const completedAt = input.completedAt;

  return {
    id: input.id,
    organizationId: input.organizationId,
    traceId: input.traceId,
    requestId: input.requestId,
    phase: input.phase,
    serviceName: input.serviceName,
    environment: input.environment,
    message: input.message,
    startedAt,
    completedAt,
    durationMs: completedAt
      ? completedAt.getTime() - startedAt.getTime()
      : undefined,
    metadata: input.metadata,
  };
}