export interface ExpensePayment {
  expenseId: string;
  paymentReference: string;
  paidAt?: Date;
}
