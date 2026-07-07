import {
  InventorySupplyChainMovement,
  InventorySupplyChainMovementType,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainMovement(input: {
  id: string;
  itemId: string;
  movementType: InventorySupplyChainMovementType;
  quantity: number;
  fromLocationId?: string;
  toLocationId?: string;
  referenceId?: string;
  reason?: string;
  occurredAt?: string;
}): InventorySupplyChainMovement {
  return {
    id: input.id,
    itemId: input.itemId,
    movementType: input.movementType,
    quantity: Math.max(0, input.quantity),
    fromLocationId: input.fromLocationId,
    toLocationId: input.toLocationId,
    referenceId: input.referenceId,
    reason: input.reason,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}

export function getInventorySupplyChainMovementDirection(
  movement: InventorySupplyChainMovement,
): "positive" | "negative" | "neutral" {
  if (movement.movementType === "inbound" || movement.movementType === "return") {
    return "positive";
  }

  if (movement.movementType === "outbound") {
    return "negative";
  }

  return "neutral";
}