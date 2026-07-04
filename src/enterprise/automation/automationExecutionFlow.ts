import { AutomationDefinition } from "./automationTypes";
import {
  runAutomationExecutionPipeline,
} from "./automationExecutionPipeline";
import {
  createAutomationMonitoringSnapshot,
  AutomationMonitoringSnapshot,
} from "./automationMonitoring";

export type AutomationExecutionFlowResult = {
  automation: AutomationDefinition;
  monitoring: AutomationMonitoringSnapshot;
};

export function executeAutomationFlow(
  automation: AutomationDefinition,
): AutomationExecutionFlowResult {
  const pipeline = runAutomationExecutionPipeline(automation);

  const monitoring = createAutomationMonitoringSnapshot(
    pipeline.context,
  );

  return {
    automation: pipeline.automation,
    monitoring,
  };
}