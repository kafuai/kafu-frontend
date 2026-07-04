import { AIAutonomousLearningRuntimeResult } from "./aiAutonomousLearningRuntime";

export type AIAutonomousLearningEventType =
  | "ai_autonomous_learning.executed"
  | "ai_autonomous_learning.insight_generated"
  | "ai_autonomous_learning.plan_generated"
  | "ai_autonomous_learning.evaluated";

export interface AIAutonomousLearningEvent {
  id: string;
  organizationId: string;
  executionId: string;
  type: AIAutonomousLearningEventType;
  message: string;
  createdAt: Date;
}

export function createAIAutonomousLearningEvents(
  result: AIAutonomousLearningRuntimeResult,
): AIAutonomousLearningEvent[] {
  const now = new Date();

  const events: AIAutonomousLearningEvent[] = [
    {
      id: `${result.executionId}-executed`,
      organizationId: result.organizationId,
      executionId: result.executionId,
      type: "ai_autonomous_learning.executed",
      message: "Autonomous learning runtime executed.",
      createdAt: now,
    },
    {
      id: `${result.executionId}-evaluated`,
      organizationId: result.organizationId,
      executionId: result.executionId,
      type: "ai_autonomous_learning.evaluated",
      message: `Autonomous learning state evaluated with score ${result.evaluation.score}.`,
      createdAt: now,
    },
  ];

  if (result.insights.length > 0) {
    events.push({
      id: `${result.executionId}-insight-generated`,
      organizationId: result.organizationId,
      executionId: result.executionId,
      type: "ai_autonomous_learning.insight_generated",
      message: `${result.insights.length} autonomous learning insight(s) generated.`,
      createdAt: now,
    });
  }

  if (result.plan) {
    events.push({
      id: `${result.executionId}-plan-generated`,
      organizationId: result.organizationId,
      executionId: result.executionId,
      type: "ai_autonomous_learning.plan_generated",
      message: `${result.plan.actions.length} autonomous learning plan action(s) generated.`,
      createdAt: now,
    });
  }

  return events;
}