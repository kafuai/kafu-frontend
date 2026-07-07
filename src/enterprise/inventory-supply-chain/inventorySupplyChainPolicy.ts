import {
  InventorySupplyChainPolicy,
  InventorySupplyChainStatus,
} from "./inventorySupplyChainTypes";

export function createInventorySupplyChainPolicy(input: {
  id: string;
  name: string;
  description: string;
  minimumReliabilityScore?: number;
  defaultSafetyStock?: number;
  autoReorderEnabled?: boolean;
  status?: InventorySupplyChainStatus;
}): InventorySupplyChainPolicy {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    minimumReliabilityScore: clampScore(input.minimumReliabilityScore ?? 0.7),
    defaultSafetyStock: Math.max(0, input.defaultSafetyStock ?? 0),
    autoReorderEnabled: input.autoReorderEnabled ?? false,
    status: input.status ?? "active",
  };
}

export function isInventorySupplyChainPolicyActive(
  policy: InventorySupplyChainPolicy,
): boolean {
  return policy.status === "active";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}