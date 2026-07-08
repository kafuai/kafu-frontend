export interface ContractParty {
  id: string;
  contractId: string;
  name: string;
  role: string;
  email?: string;
  organization?: string;
}
