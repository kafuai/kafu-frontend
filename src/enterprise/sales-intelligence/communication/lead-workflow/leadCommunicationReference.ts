import {
  createSalesCommunicationEntityReference,
} from "../salesCommunicationEntityReference";

import type {
  SalesCommunicationEntityReference,
} from "../salesCommunicationTypes";

import type {
  LeadCommunicationIdentity,
} from "./leadCommunicationTypes";

function requireLeadReferenceValue(
  name: string,
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      `Lead communication ${name} is required.`,
    );
  }

  return normalized;
}

export function createLeadCommunicationReference(
  input: LeadCommunicationIdentity,
): SalesCommunicationEntityReference {
  return createSalesCommunicationEntityReference({
    companyId: requireLeadReferenceValue(
      "company id",
      input.companyId,
    ),
    entityType: "lead",
    entityId: requireLeadReferenceValue(
      "lead id",
      input.leadId,
    ),
  });
}
