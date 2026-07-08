export interface ContractRenewal {
  id: string;
  contractId: string;
  renewalDate: string;
  autoRenew: boolean;
  renewalTerm?: string;
}
