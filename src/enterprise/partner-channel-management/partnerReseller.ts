export interface PartnerResellerAgreement {
  partnerId: string;
  territory: string;
  discountRate: number;
  active: boolean;
}

export function calculateResellerPrice(
  listPrice: number,
  agreement: PartnerResellerAgreement,
): number {
  return Math.round(listPrice * (1 - agreement.discountRate));
}
