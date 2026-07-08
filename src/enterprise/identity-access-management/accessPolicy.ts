import type {
  AccessDecision,
  IdentityAuditMetadata,
  IdentityCondition,
} from "./identityAccessManagementTypes";

export interface AccessPolicy extends IdentityAuditMetadata {
  id: string;
  name: string;
  description: string;
  decision: AccessDecision;
  resource: string;
  conditions: IdentityCondition[];
  priority: number;
  enabled: boolean;
}

export const createAccessPolicy = (policy: AccessPolicy): AccessPolicy =>
  policy;

export const isAccessPolicyEnabled = (policy: AccessPolicy): boolean =>
  policy.enabled;

export const sortAccessPoliciesByPriority = (
  policies: AccessPolicy[]
): AccessPolicy[] =>
  [...policies].sort((first, second) => first.priority - second.priority);
