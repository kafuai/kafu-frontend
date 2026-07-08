export interface ExpenseWorkflow {
  id: string;
  name: string;
  approvalSteps: string[];
  active: boolean;
}
