import {
  FinancialAmount,
  FinancialPeriod,
} from "./financialManagementTypes";

export interface FinancialBudgetAllocation {
  id: string;
  budgetId: string;
  costCenterId: string;
  period: FinancialPeriod;
  allocated: FinancialAmount;
  reserved: FinancialAmount;
  available: FinancialAmount;
}