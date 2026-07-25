import {
  createSalesCommunicationEntityReference,
} from "../salesCommunicationEntityReference";

import type {
  SalesCommunicationEntityReference,
} from "../salesCommunicationTypes";

import type {
  OpportunityCommunicationIdentity,
} from "./opportunityCommunicationTypes";

function requireOpportunityReferenceValue(
  name: string,
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      `Opportunity communication ${name} is required.`,
    );
  }

  return normalized;
}

export function createOpportunityCommunicationReference(
  input: OpportunityCommunicationIdentity,
): SalesCommunicationEntityReference {
  return createSalesCommunicationEntityReference({
    companyId: requireOpportunityReferenceValue(
      "company id",
      input.companyId,
    ),
    entityType: "opportunity",
    entityId: requireOpportunityReferenceValue(
      "opportunity id",
      input.opportunityId,
    ),
  });
}
