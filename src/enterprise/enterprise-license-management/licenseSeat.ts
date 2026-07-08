export interface LicenseSeat {
  id: string;
  licenseId: string;
  seatNumber: number;
  status: "available" | "assigned" | "reserved" | "disabled";
  assignedUserId?: string;
}
