import type {
  AccessDecision,
  IdentityAuditMetadata,
} from "./identityAccessManagementTypes";

export interface AuthorizationPolicy extends IdentityAuditMetadata {
  id: string;
  name: string;
  defaultDecision: AccessDecision;
  evaluateDenyFirst: boolean;
  enabled: boolean;
}

export const createAuthorizationPolicy = (
  policy: AuthorizationPolicy
): AuthorizationPolicy => policy;

export const isAuthorizationEnabled = (
  policy: AuthorizationPolicy
): boolean => policy.enabled;

export const shouldEvaluateDenyFirst = (
  policy: AuthorizationPolicy
): boolean => policy.evaluateDenyFirst;
