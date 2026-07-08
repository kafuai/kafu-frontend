export type SupplierSegment =
  | "strategic"
  | "operational"
  | "specialized"
  | "transactional";

export interface SupplierSegmentation {
  supplierId: string;
  segment: SupplierSegment;
  rationale: string;
}

export function isStrategicSupplier(
  segmentation: SupplierSegmentation
): boolean {
  return segmentation.segment === "strategic";
}
