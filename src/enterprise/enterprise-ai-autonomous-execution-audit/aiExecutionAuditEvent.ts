import {
  AIAutonomousExecutionAuditEvent,
  AIAutonomousExecutionAuditEventInput,
} from "./aiAutonomousExecutionAuditTypes";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

function createDeterministicHash(payload: unknown): string {
  const serialized = stableStringify(payload);
  let hash = 2166136261;

  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return `audit_${(hash >>> 0).toString(16)}`;
}

export function createAIAutonomousExecutionAuditEvent(
  input: AIAutonomousExecutionAuditEventInput,
): AIAutonomousExecutionAuditEvent {
  const occurredAt = input.occurredAt ?? new Date();

  const baseEvent = {
    action: input.action,
    actor: input.actor,
    context: input.context,
    severity: input.severity,
    outcome: input.outcome,
    metadata: input.metadata,
    occurredAt: occurredAt.toISOString(),
  };

  const immutableHash = createDeterministicHash(baseEvent);

  return {
    id: `${immutableHash}_${occurredAt.getTime()}`,
    action: input.action,
    actor: input.actor,
    context: input.context,
    severity: input.severity,
    outcome: input.outcome,
    metadata: input.metadata,
    occurredAt,
    immutableHash,
  };
}