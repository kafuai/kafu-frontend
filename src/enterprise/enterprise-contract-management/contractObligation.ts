export interface ContractObligation {
  id: string;
  contractId: string;
  title: string;
  ownerId: string;
  dueDate?: string;
  completed: boolean;
}
