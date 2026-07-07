import { ProcurementOwner } from "./procurementTypes";

export interface ProcurementApproval {
  id: string;
  requestId: string;
  approver: ProcurementOwner;
  status: "pending" | "approved" | "rejected";
  approvedAt?: string;
  comments?: string;
}