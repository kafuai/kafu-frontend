export interface ContractLifecycleStage {
  id: string;
  contractId: string;
  stage:
    | "drafting"
    | "legal_review"
    | "business_review"
    | "approval"
    | "signature"
    | "active"
    | "renewal"
    | "closure";
  startedAt: string;
  completedAt?: string;
  ownerId?: string;
}
