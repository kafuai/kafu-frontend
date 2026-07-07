export type SalesMotionType =
  | "self_serve"
  | "inside_sales"
  | "field_sales"
  | "partner_led"
  | "enterprise_sales";

export interface GoToMarketSalesMotion {
  id: string;
  type: SalesMotionType;
  averageSalesCycleDays: number;
  requiredTouchpoints: string[];
}

export function createSalesMotion(
  motion: GoToMarketSalesMotion,
): GoToMarketSalesMotion {
  return motion;
}