import { AutomationDefinition } from "./automationTypes";
import {
  orchestrateAutomation,
  AutomationOrchestrationResult,
} from "./automationOrchestrator";

export type EnterpriseAutomationIntegrationResult = {
  automationId: string;
  organizationId: string;
  orchestration: AutomationOrchestrationResult;
};

export function integrateEnterpriseAutomation(
  automation: AutomationDefinition,
): EnterpriseAutomationIntegrationResult {
  return {
    automationId: automation.id,
    organizationId: automation.organizationId,
    orchestration: orchestrateAutomation(automation),
  };
}