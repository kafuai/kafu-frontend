export interface VendorRisk {
  vendorId: string;
  level: "low" | "medium" | "high" | "critical";
  mitigationPlan?: string;
}
