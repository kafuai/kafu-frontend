import type {
  RevenueOwner,
} from "./revenueOperationsTypes";

export interface RevenueTerritory {
  id: string;
  name: string;
  owner: RevenueOwner;
  countries: string[];
}

export function territoryCoverage(
  territory: RevenueTerritory,
): number {
  return territory.countries.length;
}
