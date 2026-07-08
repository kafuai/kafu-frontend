import { EntitlementRecord } from "./entitlement";

export interface LicenseEntitlement extends EntitlementRecord {
  licenseKey: string;
  seats: number;
}

export function hasAvailableSeats(
  entitlement: LicenseEntitlement,
  allocated: number,
): boolean {
  return allocated < entitlement.seats;
}