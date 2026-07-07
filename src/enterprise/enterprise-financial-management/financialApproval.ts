import { FinancialOwner } from "./financialManagementTypes";

export interface FinancialApproval {
  id: string;
  requestId: string;
  approver: FinancialOwner;
  status: "pending" | "approved" | "rejected";
  approvedAt?: string;
  comments?: string;
}