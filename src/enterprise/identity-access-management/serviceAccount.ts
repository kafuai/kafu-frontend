import type {
  IdentityAuditMetadata,
  IdentityStatus,
} from "./identityAccessManagementTypes";

export interface ServiceAccount extends IdentityAuditMetadata {
  id: string;
  name: string;
  status: IdentityStatus;
  clientId: string;
  scopes: string[];
  expiresAt?: string;
}

export const createServiceAccount = (
  account: ServiceAccount
): ServiceAccount => account;

export const isServiceAccountActive = (
  account: ServiceAccount
): boolean => account.status === "active";

export const hasScope = (
  account: ServiceAccount,
  scope: string
): boolean => account.scopes.includes(scope);
