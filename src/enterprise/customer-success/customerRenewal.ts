export interface CustomerRenewal {
  accountId: string;
  renewalDate: Date;
  autoRenew: boolean;
  renewalProbability: number;
}

export function isRenewalUpcoming(
  renewal: CustomerRenewal,
  days: number,
): boolean {
  const diff =
    renewal.renewalDate.getTime() - Date.now();

  return diff <= days * 24 * 60 * 60 * 1000;
}