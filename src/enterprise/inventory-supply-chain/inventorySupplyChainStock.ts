import { InventorySupplyChainStockRecord } from "./inventorySupplyChainTypes";

export function calculateAvailableInventoryQuantity(
  stock: InventorySupplyChainStockRecord,
): number {
  return Math.max(0, stock.quantityOnHand - stock.quantityReserved);
}

export function isInventorySupplyChainStockBelowReorderPoint(
  stock: InventorySupplyChainStockRecord,
): boolean {
  return calculateAvailableInventoryQuantity(stock) <= stock.reorderPoint;
}

export function isInventorySupplyChainStockBelowSafetyLevel(
  stock: InventorySupplyChainStockRecord,
): boolean {
  return calculateAvailableInventoryQuantity(stock) <= stock.safetyStock;
}

export function createInventorySupplyChainStockRecord(input: {
  id: string;
  itemId: string;
  locationId: string;
  quantityOnHand: number;
  quantityReserved?: number;
  reorderPoint?: number;
  safetyStock?: number;
  updatedAt?: string;
}): InventorySupplyChainStockRecord {
  return {
    id: input.id,
    itemId: input.itemId,
    locationId: input.locationId,
    quantityOnHand: Math.max(0, input.quantityOnHand),
    quantityReserved: Math.max(0, input.quantityReserved ?? 0),
    reorderPoint: Math.max(0, input.reorderPoint ?? 0),
    safetyStock: Math.max(0, input.safetyStock ?? 0),
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}