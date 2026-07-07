import {
  InventorySupplyChainRisk,
  InventorySupplyChainRiskLevel,
  InventorySupplyChainStockRecord,
  InventorySupplyChainSupplier,
} from "./inventorySupplyChainTypes";
import { isInventorySupplyChainStockBelowSafetyLevel } from "./inventorySupplyChainStock";

export function createInventorySupplyChainRisk(input: {
  id: string;
  title: string;
  description: string;
  level?: InventorySupplyChainRiskLevel;
  itemId?: string;
  supplierId?: string;
  mitigation?: string;
  detectedAt?: string;
}): InventorySupplyChainRisk {
  return {
    id: input.id,
    itemId: input.itemId,
    supplierId: input.supplierId,
    level: input.level ?? "medium",
    title: input.title,
    description: input.description,
    mitigation: input.mitigation,
    detectedAt: input.detectedAt ?? new Date().toISOString(),
  };
}

export function detectInventorySupplyChainStockRisks(
  stocks: InventorySupplyChainStockRecord[],
): InventorySupplyChainRisk[] {
  return stocks
    .filter(isInventorySupplyChainStockBelowSafetyLevel)
    .map((stock) =>
      createInventorySupplyChainRisk({
        id: `risk-stock-${stock.id}`,
        itemId: stock.itemId,
        level: "high",
        title: "Inventory below safety stock",
        description: `Available inventory for item ${stock.itemId} is below safety stock at location ${stock.locationId}.`,
        mitigation: "Review reorder plan and supplier lead time immediately.",
      }),
    );
}

export function detectInventorySupplyChainSupplierRisks(
  suppliers: InventorySupplyChainSupplier[],
  minimumReliabilityScore = 0.7,
): InventorySupplyChainRisk[] {
  return suppliers
    .filter(
      (supplier) =>
        supplier.riskLevel === "high" ||
        supplier.riskLevel === "critical" ||
        supplier.reliabilityScore < minimumReliabilityScore,
    )
    .map((supplier) =>
      createInventorySupplyChainRisk({
        id: `risk-supplier-${supplier.id}`,
        supplierId: supplier.id,
        level: supplier.riskLevel,
        title: "Supplier reliability risk",
        description: `Supplier ${supplier.name} may impact fulfillment continuity.`,
        mitigation: "Evaluate alternative suppliers or adjust procurement buffers.",
      }),
    );
}