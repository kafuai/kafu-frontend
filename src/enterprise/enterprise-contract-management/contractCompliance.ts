export interface ContractCompliance {
  id: string;
  contractId: string;
  framework: string;
  status: "compliant" | "non_compliant" | "pending";
  lastReviewedAt?: string;
}
