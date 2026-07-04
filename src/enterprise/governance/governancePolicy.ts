import { GovernanceSeverity, GovernanceSubjectType } from "./governanceTypes";

export type GovernancePolicyEffect = "allow" | "deny" | "review";

export type GovernancePolicy = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  subjectType: GovernanceSubjectType;
  effect: GovernancePolicyEffect;
  severity: GovernanceSeverity;
  enabled: boolean;
};