export interface PartnerIncentive {
  id: string;
  partnerId: string;
  name: string;
  amount: number;
  earned: boolean;
}

export function markIncentiveEarned(
  incentive: PartnerIncentive,
): PartnerIncentive {
  return {
    ...incentive,
    earned: true,
  };
}
