import { AutomationDefinition } from "../automation";
import { GovernancePolicy } from "./governancePolicy";
import { runGovernancePipeline } from "./governancePipeline";
import { mapAutomationToGovernanceSubject } from "./governanceAutomationIntegration";

export function enforceAutomationGovernance(
  automation: AutomationDefinition,
  policies: GovernancePolicy[],
) {
  return runGovernancePipeline(
    mapAutomationToGovernanceSubject(automation),
    policies,
  );
}