import {
  InventorySupplyChainRiskLevel,
  InventorySupplyChainSupplier,
  InventorySupplyChainSupplierStatus,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainSupplier(input: {
  id: string;
  name: string;
  status?: InventorySupplyChainSupplierStatus;
  reliabilityScore?: number;
  averageLeadTimeDays?: number;
  riskLevel?: InventorySupplyChainRiskLevel;
  contactEmail?: string;
  updatedAt?: string;
}): InventorySupplyChainSupplier {
  return {
    id: input.id,
    name: input.name,
    status: input.status ?? "active",
    reliabilityScore: clampScore(input.reliabilityScore ?? 0.75),
    averageLeadTimeDays: Math.max(0, input.averageLeadTimeDays ?? 0),
    riskLevel: input.riskLevel ?? "low",
    contactEmail: input.contactEmail,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

export function isInventorySupplyChainSupplierEligible(
  supplier: InventorySupplyChainSupplier,
  minimumReliabilityScore = 0.7,
): boolean {
  return (
    supplier.status !== "inactive" &&
    supplier.status !== "restricted" &&
    supplier.reliabilityScore >= minimumReliabilityScore
  );
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}