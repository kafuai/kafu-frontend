import {
  FinancialAmount,
  FinancialOwner,
} from "./financialManagementTypes";

export interface FinancialInvestment {
  id: string;
  initiative: string;
  owner: FinancialOwner;
  investment: FinancialAmount;
  expectedReturn: FinancialAmount;
  strategicPriority: string;
}