export interface ExpenseReimbursement {
  expenseId: string;
  employeeId: string;
  amount: number;
  reimbursedAt?: Date;
}
