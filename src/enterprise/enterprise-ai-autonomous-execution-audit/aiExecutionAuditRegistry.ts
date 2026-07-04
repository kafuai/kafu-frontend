import { AIAutonomousExecutionAuditEvent } from "./aiAutonomousExecutionAuditTypes";
import {
  AIAutonomousExecutionAuditTrail,
  appendAIAutonomousExecutionAuditEvent,
  createAIAutonomousExecutionAuditTrail,
} from "./aiExecutionAuditTrail";

export interface AIAutonomousExecutionAuditRegistry {
  trails: AIAutonomousExecutionAuditTrail[];
}

export function createAIAutonomousExecutionAuditRegistry(): AIAutonomousExecutionAuditRegistry {
  return {
    trails: [],
  };
}

export function registerAIAutonomousExecutionAuditEvent(
  registry: AIAutonomousExecutionAuditRegistry,
  event: AIAutonomousExecutionAuditEvent,
): AIAutonomousExecutionAuditRegistry {
  const existingTrail = registry.trails.find(
    (trail) =>
      trail.tenantId === event.context.tenantId &&
      trail.executionId === event.context.executionId,
  );

  if (!existingTrail) {
    return {
      trails: [
        ...registry.trails,
        createAIAutonomousExecutionAuditTrail(
          event.context.tenantId,
          event.context.executionId,
          [event],
        ),
      ],
    };
  }

  return {
    trails: registry.trails.map((trail) =>
      trail.tenantId === event.context.tenantId &&
      trail.executionId === event.context.executionId
        ? appendAIAutonomousExecutionAuditEvent(trail, event)
        : trail,
    ),
  };
}