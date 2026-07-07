import { CustomerProfile } from "./customerRelationshipManagementTypes";

export function createCustomerProfile(input: {
  id: string;
  accountId: string;
  displayName: string;
  email?: string;
  phone?: string;
  role?: string;
  preferences?: Record<string, unknown>;
  updatedAt?: string;
}): CustomerProfile {
  return {
    id: input.id,
    accountId: input.accountId,
    displayName: input.displayName,
    email: input.email,
    phone: input.phone,
    role: input.role,
    preferences: input.preferences,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function hasCustomerProfileContactInfo(profile: CustomerProfile): boolean {
  return Boolean(profile.email || profile.phone);
}