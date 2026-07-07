import {
  FinancialAmount,
  FinancialOwner,
} from "./financialManagementTypes";

export interface FinancialExpense {
  id: string;
  title: string;
  amount: FinancialAmount;
  owner: FinancialOwner;
  category: string;
  approved: boolean;
  createdAt: string;
}