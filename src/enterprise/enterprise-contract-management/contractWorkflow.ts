export interface ContractWorkflow {
  id: string;
  contractId: string;
  currentStep: string;
  status: "pending" | "running" | "completed" | "failed";
}
