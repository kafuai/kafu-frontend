import { AutomationDefinition } from "./automationTypes";
import {
  integrateEnterpriseAutomation,
  EnterpriseAutomationIntegrationResult,
} from "./automationEnterpriseIntegration";

export type AutomationFinalizationResult = {
  automationId: string;
  organizationId: string;
  completed: boolean;
  integration: EnterpriseAutomationIntegrationResult;
  finalizedAt: Date;
};

export function finalizeAutomationLayer(
  automation: AutomationDefinition,
): AutomationFinalizationResult {
  return {
    automationId: automation.id,
    organizationId: automation.organizationId,
    completed: true,
    integration: integrateEnterpriseAutomation(automation),
    finalizedAt: new Date(),
  };
}