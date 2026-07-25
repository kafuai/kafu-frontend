import {
  createSalesCommunicationEntityReference,
} from "../salesCommunicationEntityReference";

import type {
  SalesCommunicationEntityReference,
} from "../salesCommunicationTypes";

import type {
  DiscoveryCommunicationIdentity,
} from "./discoveryCommunicationTypes";

function requireDiscoveryReferenceValue(
  name: string,
  value: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(
      `Discovery communication ${name} is required.`,
    );
  }

  return normalized;
}

export function createDiscoveryCommunicationReference(
  input: DiscoveryCommunicationIdentity,
): SalesCommunicationEntityReference {
  return createSalesCommunicationEntityReference({
    companyId: requireDiscoveryReferenceValue(
      "company id",
      input.companyId,
    ),
    entityType: "discovery",
    entityId: requireDiscoveryReferenceValue(
      "discovery id",
      input.discoveryId,
    ),
  });
}
