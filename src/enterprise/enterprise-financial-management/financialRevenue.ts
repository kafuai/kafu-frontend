import {
  FinancialAmount,
  FinancialOwner,
} from "./financialManagementTypes";

export interface FinancialRevenue {
  id: string;
  source: string;
  amount: FinancialAmount;
  owner: FinancialOwner;
  receivedAt: string;
}