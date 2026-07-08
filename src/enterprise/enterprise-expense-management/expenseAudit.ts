export interface ExpenseAudit {
  id: string;
  expenseId: string;
  auditorId: string;
  auditDate: Date;
  findings?: string;
}
