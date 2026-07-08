export interface ExpenseClaim {
  id: string;
  employeeId: string;
  expenseIds: string[];
  submittedAt: Date;
}
