import { ExpenseAnalytics } from "./expenseAnalytics";

export interface ExpenseDashboard {
  generatedAt: Date;
  analytics: ExpenseAnalytics;
}
