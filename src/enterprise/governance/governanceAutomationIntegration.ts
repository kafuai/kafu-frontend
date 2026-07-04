import { AutomationDefinition } from "../automation";
import {
  GovernanceSubject,
  GovernanceSubjectType,
} from "./governanceTypes";

export function mapAutomationToGovernanceSubject(
  automation: AutomationDefinition,
): GovernanceSubject {
  return {
    id: automation.id,
    type: "automation" satisfies GovernanceSubjectType,
    organizationId: automation.organizationId,
  };
}