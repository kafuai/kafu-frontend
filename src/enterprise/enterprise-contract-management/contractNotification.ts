export interface ContractNotification {
  id: string;
  contractId: string;
  type: string;
  recipient: string;
  scheduledAt: string;
  sent: boolean;
}
