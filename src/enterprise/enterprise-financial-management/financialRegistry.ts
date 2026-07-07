import { FinancialBudget } from "./financialBudget";

export class FinancialRegistry {
  private readonly budgets = new Map<string, FinancialBudget>();

  registerBudget(budget: FinancialBudget): void {
    this.budgets.set(budget.id, budget);
  }

  getBudget(id: string): FinancialBudget | undefined {
    return this.budgets.get(id);
  }

  listBudgets(): FinancialBudget[] {
    return Array.from(this.budgets.values());
  }
}