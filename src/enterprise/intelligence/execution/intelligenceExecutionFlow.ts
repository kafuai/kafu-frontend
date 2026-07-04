import { ExecutionPlan } from "./executionTypes";
import { ExecutionValidator } from "./executionValidator";
import {
  createExecutionMonitoringSnapshot,
  ExecutionMonitoringSnapshot,
} from "./executionMonitoring";

export type IntelligenceExecutionFlowResult = {
  plan: ExecutionPlan;
  monitoring: ExecutionMonitoringSnapshot;
};

export function executeIntelligenceFlow(
  plan: ExecutionPlan,
): IntelligenceExecutionFlowResult {
  const validator = new ExecutionValidator();
  const validation = validator.validate(plan);

  if (!validation.valid) {
    throw new Error(validation.errors.join(", "));
  }

  const monitoring = createExecutionMonitoringSnapshot(plan);

  return {
    plan,
    monitoring,
  };
}