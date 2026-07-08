export interface ExpenseCategory {
  id: string;
  name: string;
  reimbursable: boolean;
  spendingLimit?: number;
}
