import { EntitlementRecord } from "./entitlement";

export interface SeatEntitlement extends EntitlementRecord {
  totalSeats: number;
  assignedSeats: number;
}

export function getAvailableSeats(entitlement: SeatEntitlement): number {
  return Math.max(entitlement.totalSeats - entitlement.assignedSeats, 0);
}

export function canAssignSeat(entitlement: SeatEntitlement): boolean {
  return entitlement.status === "active" && getAvailableSeats(entitlement) > 0;
}