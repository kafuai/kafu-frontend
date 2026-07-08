export interface PartnerAnalytics {
  totalPartners: number;
  activePartners: number;
  totalRevenue: number;
  totalPipeline: number;
}

export function calculatePartnerActivityRate(
  analytics: PartnerAnalytics,
): number {
  if (analytics.totalPartners === 0) return 0;

  return analytics.activePartners / analytics.totalPartners;
}
