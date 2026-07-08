export interface ExpenseApproval {
  expenseId: string;
  approverId: string;
  approved: boolean;
  reviewedAt: Date;
  comments?: string;
}
