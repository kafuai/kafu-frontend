import {
  CustomerAccount,
  CustomerRelationshipAccountType,
  CustomerRelationshipStatus,
} from "./customerRelationshipManagementTypes";

export function createCustomerAccount(input: {
  id: string;
  name: string;
  type: CustomerRelationshipAccountType;
  industry?: string;
  region?: string;
  annualRevenue?: number;
  employeeCount?: number;
  status?: CustomerRelationshipStatus;
  createdAt?: string;
  updatedAt?: string;
}): CustomerAccount {
  const now = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    type: input.type,
    industry: input.industry,
    region: input.region,
    annualRevenue: input.annualRevenue,
    employeeCount: input.employeeCount,
    status: input.status ?? "prospect",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isStrategicCustomerAccount(account: CustomerAccount): boolean {
  return account.type === "enterprise" || account.type === "public_sector";
}