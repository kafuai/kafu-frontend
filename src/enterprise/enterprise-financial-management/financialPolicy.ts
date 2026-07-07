import { FinancialPriority } from "./financialManagementTypes";

export interface FinancialPolicy {
  id: string;
  name: string;
  description: string;
  priority: FinancialPriority;
  approvalRequiredAbove: number;
  active: boolean;
}