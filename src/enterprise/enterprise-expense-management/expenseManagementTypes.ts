export type ExpenseStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "reimbursed"
  | "cancelled";

export type ExpenseRiskLevel = "low" | "medium" | "high" | "critical";

export interface ExpenseReference {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  status: ExpenseStatus;
}
