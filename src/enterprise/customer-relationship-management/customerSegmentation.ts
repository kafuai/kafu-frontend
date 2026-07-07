import {
  CustomerAccount,
  CustomerRelationshipPriority,
  CustomerSegment,
} from "./customerRelationshipManagementTypes";
import { isStrategicCustomerAccount } from "./customerAccount";

export function createCustomerSegment(input: {
  id: string;
  name: string;
  description: string;
  criteria?: Record<string, unknown>;
  accountIds?: string[];
  updatedAt?: string;
}): CustomerSegment {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    criteria: input.criteria ?? {},
    accountIds: input.accountIds ?? [],
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function assignCustomerRelationshipPriority(
  account: CustomerAccount,
): CustomerRelationshipPriority {
  if (isStrategicCustomerAccount(account)) {
    return "strategic";
  }

  if ((account.annualRevenue ?? 0) >= 1_000_000) {
    return "high";
  }

  if ((account.employeeCount ?? 0) >= 50) {
    return "medium";
  }

  return "low";
}