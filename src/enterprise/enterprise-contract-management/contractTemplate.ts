export interface ContractTemplate {
  id: string;
  name: string;
  contractType: string;
  version: string;
  clauses: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
