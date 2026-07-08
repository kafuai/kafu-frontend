export interface ContractApproval {
  id: string;
  contractId: string;
  approverId: string;
  status: "pending" | "approved" | "rejected" | "changes_requested";
  comments?: string;
  decidedAt?: string;
}
