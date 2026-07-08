export interface RevenuePricingModel {
  id: string;
  name: string;
  currency: string;
  basePrice: number;
  discountLimit: number;
}

export function calculateNetPrice(
  basePrice: number,
  discountPercent: number,
): number {
  return basePrice * (1 - discountPercent / 100);
}
