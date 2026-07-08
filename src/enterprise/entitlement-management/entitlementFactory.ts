import {
  EnterpriseEntitlement,
  EntitlementStatus,
  EntitlementType,
} from "./entitlementTypes";

export interface EntitlementFactoryInput {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: EntitlementType;
  status?: EntitlementStatus;
  validFrom?: Date;
  validUntil?: Date;
}

export function createEnterpriseEntitlement(
  input: EntitlementFactoryInput,
): EnterpriseEntitlement {
  return {
    id: input.id,
    tenantId: input.tenantId,
    code: input.code,
    name: input.name,
    type: input.type,
    status: input.status ?? "active",
    validFrom: input.validFrom ?? new Date(),
    validUntil: input.validUntil,
  };
}