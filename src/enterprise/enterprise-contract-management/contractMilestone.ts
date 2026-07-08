export interface ContractMilestone {
  id: string;
  contractId: string;
  name: string;
  targetDate: string;
  completedDate?: string;
}
