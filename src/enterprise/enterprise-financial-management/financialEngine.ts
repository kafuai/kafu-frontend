import { FinancialAmount } from "./financialManagementTypes";
import { FinancialBudget } from "./financialBudget";
import { FinancialMetrics } from "./financialMetrics";

export class FinancialEngine {
  calculateRemaining(budget: FinancialBudget): FinancialAmount {
    return {
      value: budget.allocated.value - budget.consumed.value,
      currency: budget.allocated.currency,
    };
  }

  calculateProfitMargin(revenue: FinancialAmount, expenses: FinancialAmount): number {
    if (revenue.value <= 0) {
      return 0;
    }

    return ((revenue.value - expenses.value) / revenue.value) * 100;
  }

  createMetrics(
    totalBudget: FinancialAmount,
    totalConsumed: FinancialAmount,
    totalRevenue: FinancialAmount,
    totalExpenses: FinancialAmount,
  ): FinancialMetrics {
    return {
      totalBudget,
      totalConsumed,
      totalRemaining: {
        value: totalBudget.value - totalConsumed.value,
        currency: totalBudget.currency,
      },
      totalRevenue,
      totalExpenses,
      profitMarginPercentage: this.calculateProfitMargin(totalRevenue, totalExpenses),
    };
  }
}