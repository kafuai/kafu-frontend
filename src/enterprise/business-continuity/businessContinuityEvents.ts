export type BusinessContinuityEventType =
  | "plan_created"
  | "plan_updated"
  | "exercise_started"
  | "exercise_completed"
  | "recovery_started"
  | "recovery_completed"
  | "dependency_changed";

export type BusinessContinuityEvent = {
  id: string;
  type: BusinessContinuityEventType;
  timestamp: string;
  resourceId: string;
  organizationId: string;
  actor?: string;
  metadata?: Record<string, unknown>;
};

export function createBusinessContinuityEvent(
  event: Omit<BusinessContinuityEvent, "timestamp">,
): BusinessContinuityEvent {
  return {
    ...event,
    timestamp: new Date().toISOString(),
  };
}