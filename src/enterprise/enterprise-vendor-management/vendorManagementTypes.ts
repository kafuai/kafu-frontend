export type VendorStatus =
  | "prospect"
  | "qualified"
  | "active"
  | "suspended"
  | "terminated";

export interface VendorReference {
  id: string;
  name: string;
  status: VendorStatus;
}
