import {
  SalesManagementStatus,
  SalesTerritory,
} from "./salesManagementTypes";

export function createSalesTerritory(input: {
  id: string;
  name: string;
  region?: string;
  ownerId?: string;
  accountIds?: string[];
  status?: SalesManagementStatus;
  updatedAt?: string;
}): SalesTerritory {
  return {
    id: input.id,
    name: input.name,
    region: input.region,
    ownerId: input.ownerId,
    accountIds: input.accountIds ?? [],
    status: input.status ?? "active",
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function isSalesTerritoryActive(territory: SalesTerritory): boolean {
  return territory.status === "active";
}