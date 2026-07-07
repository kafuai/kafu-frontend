import {
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionStatus,
} from "../../enterprise/ai-autonomous-execution";

export interface DemoEnvironmentExecutionScenarioInput {
  organizationId: string;
  scenarioId: string;
  executionId: string;
  executionTitle: string;
  executionStatus: AIAutonomousExecutionStatus;
  priority: AIAutonomousExecutionPriority;
  simulatedTasks: number;
  successfulTasks: number;
  failedTasks: number;
}

export interface DemoEnvironmentExecutionScenarioResult {
  scenarioTitle: string;
  executionSummary: string;
  successRate: number;
  recommendation: string;
}

export function buildDemoEnvironmentExecutionScenario(
  input: DemoEnvironmentExecutionScenarioInput,
): DemoEnvironmentExecutionScenarioResult {
  const successRate =
    input.simulatedTasks === 0
      ? 0
      : Math.round(
          (input.successfulTasks / input.simulatedTasks) * 100,
        );

  const recommendation =
    input.failedTasks > 0
      ? "Review failed execution paths before production deployment."
      : input.executionStatus === "completed"
        ? "Scenario validated successfully and ready for demonstration."
        : "Continue simulation until all execution paths complete.";

  return {
    scenarioTitle: `Demo Scenario - ${input.executionTitle}`,
    executionSummary: `${input.successfulTasks}/${input.simulatedTasks} tasks completed successfully with ${input.failedTasks} failure(s).`,
    successRate,
    recommendation,
  };
}