import {
  AIAgentConflict,
  AIAgentConflictSeverity,
  resolveAIAgentConflict,
  escalateAIAgentConflict,
} from "./aiAgentConflict";

export interface AIAgentConflictResolutionRule {
  severity: AIAgentConflictSeverity;
  autoResolve: boolean;
  resolution: string;
}

export interface AIAgentConflictResolutionResult {
  conflictId: string;
  resolved: boolean;
  escalated: boolean;
  resolution: string;
  conflict: AIAgentConflict;
}

export function resolveAIAgentConflictByRule(
  conflict: AIAgentConflict,
  rules: AIAgentConflictResolutionRule[],
): AIAgentConflictResolutionResult {
  const rule = rules.find((item) => item.severity === conflict.severity);

  if (!rule) {
    const escalatedConflict = escalateAIAgentConflict(conflict);

    return {
      conflictId: conflict.id,
      resolved: false,
      escalated: true,
      resolution: "No matching conflict resolution rule found",
      conflict: escalatedConflict,
    };
  }

  if (!rule.autoResolve) {
    const escalatedConflict = escalateAIAgentConflict(conflict);

    return {
      conflictId: conflict.id,
      resolved: false,
      escalated: true,
      resolution: rule.resolution,
      conflict: escalatedConflict,
    };
  }

  const resolvedConflict = resolveAIAgentConflict(conflict, rule.resolution);

  return {
    conflictId: conflict.id,
    resolved: true,
    escalated: false,
    resolution: rule.resolution,
    conflict: resolvedConflict,
  };
}

export function createDefaultAIAgentConflictResolutionRules(): AIAgentConflictResolutionRule[] {
  return [
    {
      severity: "low",
      autoResolve: true,
      resolution: "Auto-resolved using lowest-risk collaboration preference",
    },
    {
      severity: "medium",
      autoResolve: true,
      resolution: "Auto-resolved using team lead decision preference",
    },
    {
      severity: "high",
      autoResolve: false,
      resolution: "Escalated to human supervisor due to high severity",
    },
    {
      severity: "critical",
      autoResolve: false,
      resolution: "Escalated immediately due to critical collaboration risk",
    },
  ];
}