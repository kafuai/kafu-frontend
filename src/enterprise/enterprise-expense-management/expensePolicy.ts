export interface ExpensePolicy {
  id: string;
  name: string;
  categoryIds: string[];
  maxAmount?: number;
  requiresReceipt: boolean;
}
