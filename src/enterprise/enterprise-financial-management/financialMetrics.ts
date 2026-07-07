import { FinancialAmount } from "./financialManagementTypes";

export interface FinancialMetrics {
  totalBudget: FinancialAmount;
  totalConsumed: FinancialAmount;
  totalRemaining: FinancialAmount;
  totalRevenue: FinancialAmount;
  totalExpenses: FinancialAmount;
  profitMarginPercentage: number;
}