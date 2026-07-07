import {
  InventorySupplyChainEvent,
  InventorySupplyChainRiskLevel,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainEvent(input: {
  id: string;
  type: string;
  title: string;
  description: string;
  severity?: InventorySupplyChainRiskLevel;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}): InventorySupplyChainEvent {
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    description: input.description,
    severity: input.severity ?? "low",
    createdAt: input.createdAt ?? new Date().toISOString(),
    metadata: input.metadata,
  };
}

export function createInventorySupplyChainRiskEvent(input: {
  id: string;
  title: string;
  description: string;
  severity: InventorySupplyChainRiskLevel;
  metadata?: Record<string, unknown>;
}): InventorySupplyChainEvent {
  return createInventorySupplyChainEvent({
    id: input.id,
    type: "inventory_supply_chain_risk",
    title: input.title,
    description: input.description,
    severity: input.severity,
    metadata: input.metadata,
  });
}