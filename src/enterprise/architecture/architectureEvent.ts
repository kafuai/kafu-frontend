export interface ArchitectureEvent {
  id: string;
  type: string;
  occurredAt: string;
  actor: string;
  description: string;
}

export function createArchitectureEvent(
  event: ArchitectureEvent,
): ArchitectureEvent {
  return { ...event };
}

export function sortArchitectureEvents(
  events: ArchitectureEvent[],
): ArchitectureEvent[] {
  return [...events].sort((a, b) =>
    a.occurredAt.localeCompare(b.occurredAt),
  );
}