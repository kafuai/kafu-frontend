import { runAIAutonomousExecutionEngine } from "./aiAutonomousExecutionEngine";
import {
  createAIAutonomousExecutionAuditRecord,
} from "./aiAutonomousExecutionAudit";
import {
  createAIAutonomousExecutionReport,
  AIAutonomousExecutionReport,
} from "./aiAutonomousExecutionReporter";
import { AIAutonomousExecutionEngineInput } from "./aiAutonomousExecutionEngine";
import { createAIAutonomousExecutionEvent } from "./aiAutonomousExecutionEvents";

export interface AIAutonomousExecutionRuntimeResult {
  report: AIAutonomousExecutionReport;
}

export function runAIAutonomousExecutionRuntime(
  input: AIAutonomousExecutionEngineInput,
): AIAutonomousExecutionRuntimeResult {
  const executionResult = runAIAutonomousExecutionEngine(input);

  createAIAutonomousExecutionEvent({
    id: `${executionResult.executionId}-completed`,
    executionId: executionResult.executionId,
    planId: executionResult.planId,
    organizationId: executionResult.organizationId,
    type: "execution.completed",
    status: executionResult.status,
    message: "Autonomous execution finished.",
  });

  const audit = createAIAutonomousExecutionAuditRecord(executionResult);

  const report = createAIAutonomousExecutionReport(audit);

  return {
    report,
  };
}