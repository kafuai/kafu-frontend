import type {
  IdentityAuditMetadata,
  IdentityProviderType,
  IdentityStatus,
} from "./identityAccessManagementTypes";

export interface IdentityProvider extends IdentityAuditMetadata {
  id: string;
  name: string;
  type: IdentityProviderType;
  status: IdentityStatus;
  issuer?: string;
  clientId?: string;
  domain?: string;
  autoProvisionUsers: boolean;
}

export const createIdentityProvider = (
  provider: IdentityProvider
): IdentityProvider => provider;

export const isIdentityProviderActive = (
  provider: IdentityProvider
): boolean => provider.status === "active";

export const supportsAutoProvisioning = (
  provider: IdentityProvider
): boolean => provider.autoProvisionUsers;
