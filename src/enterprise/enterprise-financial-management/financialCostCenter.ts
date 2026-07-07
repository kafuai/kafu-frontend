import { FinancialOwner } from "./financialManagementTypes";

export interface FinancialCostCenter {
  id: string;
  code: string;
  name: string;
  owner: FinancialOwner;
  description?: string;
}