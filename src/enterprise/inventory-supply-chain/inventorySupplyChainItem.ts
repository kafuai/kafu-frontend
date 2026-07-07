import {
  InventorySupplyChainItem,
  InventorySupplyChainItemCategory,
  InventorySupplyChainPriority,
  InventorySupplyChainStatus,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainItem(input: {
  id: string;
  name: string;
  category: InventorySupplyChainItemCategory;
  unitOfMeasure: string;
  sku?: string;
  description?: string;
  priority?: InventorySupplyChainPriority;
  status?: InventorySupplyChainStatus;
  createdAt?: string;
  updatedAt?: string;
}): InventorySupplyChainItem {
  const now = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    category: input.category,
    sku: input.sku,
    description: input.description,
    unitOfMeasure: input.unitOfMeasure,
    priority: input.priority ?? "medium",
    status: input.status ?? "active",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isInventorySupplyChainItemActive(
  item: InventorySupplyChainItem,
): boolean {
  return item.status === "active";
}