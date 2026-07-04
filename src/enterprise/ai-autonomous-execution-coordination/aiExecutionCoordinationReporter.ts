import {
  AIExecutionCoordinationConflictSeverity,
  AIExecutionCoordinationConflictType,
} from "./aiAutonomousExecutionCoordinationTypes";
import { AIExecutionCoordinationPlan } from "./aiExecutionCoordinationPlanner";

export interface AIExecutionCoordinationReport {
  planId: string;
  generatedAt: Date;
  totalTasks: number;
  readyTasks: number;
  blockedTasks: number;
  conflictedTasks: number;
  readinessScore: number;
  isExecutionCoordinated: boolean;
  conflictSummary: Record<AIExecutionCoordinationConflictType, number>;
  severitySummary: Record<AIExecutionCoordinationConflictSeverity, number>;
  blockerReasons: string[];
}

export function createAIExecutionCoordinationReport(
  plan: AIExecutionCoordinationPlan,
  generatedAt = new Date(),
): AIExecutionCoordinationReport {
  return {
    planId: plan.id,
    generatedAt,
    totalTasks: plan.tasks.length,
    readyTasks: plan.readyTasks.length,
    blockedTasks: plan.blockedTasks.length,
    conflictedTasks: plan.conflictedTasks.length,
    readinessScore: plan.readiness.score,
    isExecutionCoordinated: plan.readiness.isReady,
    conflictSummary: summarizeConflictTypes(plan),
    severitySummary: summarizeConflictSeverities(plan),
    blockerReasons: collectBlockerReasons(plan),
  };
}

function summarizeConflictTypes(
  plan: AIExecutionCoordinationPlan,
): Record<AIExecutionCoordinationConflictType, number> {
  return plan.conflicts.reduce(
    (summary, conflict) => ({
      ...summary,
      [conflict.type]: summary[conflict.type] + 1,
    }),
    {
      dependency: 0,
      resource: 0,
      timing: 0,
      ownership: 0,
      policy: 0,
      capacity: 0,
    },
  );
}

function summarizeConflictSeverities(
  plan: AIExecutionCoordinationPlan,
): Record<AIExecutionCoordinationConflictSeverity, number> {
  return plan.conflicts.reduce(
    (summary, conflict) => ({
      ...summary,
      [conflict.severity]: summary[conflict.severity] + 1,
    }),
    {
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
  );
}

function collectBlockerReasons(plan: AIExecutionCoordinationPlan): string[] {
  const dependencyReasons = plan.dependencyResults.flatMap(
    (result) => result.readiness.reasons,
  );

  const conflictReasons = plan.conflicts.map((conflict) => conflict.reason);

  return [...new Set([...dependencyReasons, ...conflictReasons])];
}