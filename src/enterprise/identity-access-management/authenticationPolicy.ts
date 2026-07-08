import type { IdentityAuditMetadata } from "./identityAccessManagementTypes";

export interface AuthenticationPolicy extends IdentityAuditMetadata {
  id: string;
  requireMfa: boolean;
  sessionTimeoutMinutes: number;
  maxFailedAttempts: number;
  passwordRotationDays: number;
}

export const defaultAuthenticationPolicy: AuthenticationPolicy = {
  id: "default",
  requireMfa: true,
  sessionTimeoutMinutes: 60,
  maxFailedAttempts: 5,
  passwordRotationDays: 90,
  createdAt: "",
  updatedAt: "",
};

export const requiresMfa = (
  policy: AuthenticationPolicy
): boolean => policy.requireMfa;
