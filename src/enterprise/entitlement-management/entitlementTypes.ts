export type EntitlementStatus =
  | "active"
  | "inactive"
  | "expired"
  | "suspended";

export type EntitlementType =
  | "feature"
  | "license"
  | "seat"
  | "quota";

export interface EnterpriseEntitlement {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: EntitlementType;
  status: EntitlementStatus;
  validFrom: Date;
  validUntil?: Date;
}