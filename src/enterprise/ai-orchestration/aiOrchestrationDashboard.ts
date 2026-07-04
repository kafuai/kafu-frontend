import { AIOrchestrationAnalytics } from "./aiOrchestrationAnalytics";
import { AIOrchestrationMetrics } from "./aiOrchestrationMetrics";

export interface AIOrchestrationDashboardCard {
  id: string;
  title: string;
  value: string | number;
  severity: "neutral" | "success" | "warning" | "critical";
}

export interface AIOrchestrationDashboard {
  organizationId: string;
  workflowId: string;
  executionId: string;
  cards: AIOrchestrationDashboardCard[];
  recommendations: string[];
  updatedAt: Date;
}

export function createAIOrchestrationDashboard(
  metrics: AIOrchestrationMetrics,
  analytics: AIOrchestrationAnalytics,
): AIOrchestrationDashboard {
  return {
    organizationId: metrics.organizationId,
    workflowId: metrics.workflowId,
    executionId: metrics.executionId,
    cards: [
      {
        id: "total-steps",
        title: "Total Steps",
        value: metrics.totalSteps,
        severity: "neutral",
      },
      {
        id: "success-rate",
        title: "Success Rate",
        value: `${Math.round(metrics.successRate * 100)}%`,
        severity:
          metrics.successRate >= 0.9
            ? "success"
            : metrics.successRate >= 0.75
              ? "warning"
              : "critical",
      },
      {
        id: "failed-steps",
        title: "Failed Steps",
        value: metrics.failedSteps,
        severity: metrics.failedSteps > 0 ? "critical" : "success",
      },
      {
        id: "avg-step-duration",
        title: "Average Step Duration",
        value: `${Math.round(metrics.averageStepDurationMs)}ms`,
        severity:
          metrics.averageStepDurationMs > 10_000 ? "warning" : "neutral",
      },
    ],
    recommendations: analytics.recommendations,
    updatedAt: new Date(),
  };
}