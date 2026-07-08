import { ExpenseReference } from "./expenseManagementTypes";

export interface Expense extends ExpenseReference {
  categoryId: string;
  description: string;
  incurredAt: Date;
}
