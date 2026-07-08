export interface PartnerPerformance {
  partnerId: string;
  revenue: number;
  dealsRegistered: number;
  dealsWon: number;
  referralsConverted: number;
}

export function calculatePartnerWinRate(
  performance: PartnerPerformance,
): number {
  if (performance.dealsRegistered === 0) return 0;

  return performance.dealsWon / performance.dealsRegistered;
}
