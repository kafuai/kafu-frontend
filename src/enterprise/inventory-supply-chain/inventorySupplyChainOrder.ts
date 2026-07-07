import {
  InventorySupplyChainOrder,
  InventorySupplyChainOrderStatus,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainOrder(input: {
  id: string;
  supplierId: string;
  itemId: string;
  quantity: number;
  status?: InventorySupplyChainOrderStatus;
  expectedDeliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}): InventorySupplyChainOrder {
  const now = new Date().toISOString();

  return {
    id: input.id,
    supplierId: input.supplierId,
    itemId: input.itemId,
    quantity: Math.max(0, input.quantity),
    status: input.status ?? "planned",
    expectedDeliveryDate: input.expectedDeliveryDate,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isInventorySupplyChainOrderOpen(
  order: InventorySupplyChainOrder,
): boolean {
  return !["received", "cancelled"].includes(order.status);
}