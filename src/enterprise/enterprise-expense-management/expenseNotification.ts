export interface ExpenseNotification {
  expenseId: string;
  recipientId: string;
  message: string;
  sentAt: Date;
}
