import { ProcurementPriority } from "./procurementTypes";

export interface ProcurementPolicy {
  id: string;
  name: string;
  description: string;
  priority: ProcurementPriority;
  approvalRequiredAbove: number;
  preferredVendorRequired: boolean;
  active: boolean;
}