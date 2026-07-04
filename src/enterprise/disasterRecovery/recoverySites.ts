import { RecoverySiteType } from "./disasterRecoveryTypes";

export type RecoverySiteStatus =
  | "available"
  | "maintenance"
  | "offline";

export type RecoverySite = {
  id: string;
  organizationId: string;
  name: string;
  type: RecoverySiteType;
  region: string;
  status: RecoverySiteStatus;
  capacityPercent: number;
  priority: number;
};

export function createRecoverySite(
  site: RecoverySite,
): RecoverySite {
  return {
    ...site,
    capacityPercent: Math.max(0, Math.min(100, site.capacityPercent)),
  };
}

export function isRecoverySiteAvailable(
  site: RecoverySite,
): boolean {
  return site.status === "available";
}

export function sortRecoverySites(
  sites: RecoverySite[],
): RecoverySite[] {
  return [...sites].sort((a, b) => a.priority - b.priority);
}