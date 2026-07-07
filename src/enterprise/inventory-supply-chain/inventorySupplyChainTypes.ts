export type InventorySupplyChainStatus =
  | "draft"
  | "active"
  | "paused"
  | "blocked"
  | "completed"
  | "archived";

export type InventorySupplyChainPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type InventorySupplyChainRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type InventorySupplyChainMovementType =
  | "inbound"
  | "outbound"
  | "transfer"
  | "adjustment"
  | "return";

export type InventorySupplyChainItemCategory =
  | "raw_material"
  | "finished_good"
  | "component"
  | "equipment"
  | "consumable"
  | "digital_asset"
  | "other";

export type InventorySupplyChainSupplierStatus =
  | "active"
  | "under_review"
  | "preferred"
  | "restricted"
  | "inactive";

export type InventorySupplyChainOrderStatus =
  | "planned"
  | "requested"
  | "approved"
  | "ordered"
  | "partially_received"
  | "received"
  | "cancelled";

export interface InventorySupplyChainItem {
  id: string;
  name: string;
  category: InventorySupplyChainItemCategory;
  sku?: string;
  description?: string;
  unitOfMeasure: string;
  status: InventorySupplyChainStatus;
  priority: InventorySupplyChainPriority;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySupplyChainStockRecord {
  id: string;
  itemId: string;
  locationId: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
  safetyStock: number;
  updatedAt: string;
}

export interface InventorySupplyChainMovement {
  id: string;
  itemId: string;
  movementType: InventorySupplyChainMovementType;
  quantity: number;
  fromLocationId?: string;
  toLocationId?: string;
  referenceId?: string;
  reason?: string;
  occurredAt: string;
}

export interface InventorySupplyChainSupplier {
  id: string;
  name: string;
  status: InventorySupplyChainSupplierStatus;
  reliabilityScore: number;
  averageLeadTimeDays: number;
  riskLevel: InventorySupplyChainRiskLevel;
  contactEmail?: string;
  updatedAt: string;
}

export interface InventorySupplyChainOrder {
  id: string;
  supplierId: string;
  itemId: string;
  quantity: number;
  status: InventorySupplyChainOrderStatus;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySupplyChainDemandSignal {
  id: string;
  itemId: string;
  expectedQuantity: number;
  confidence: number;
  source: string;
  expectedDate: string;
}

export interface InventorySupplyChainForecast {
  id: string;
  itemId: string;
  forecastQuantity: number;
  confidence: number;
  horizonDays: number;
  generatedAt: string;
}

export interface InventorySupplyChainRisk {
  id: string;
  itemId?: string;
  supplierId?: string;
  level: InventorySupplyChainRiskLevel;
  title: string;
  description: string;
  mitigation?: string;
  detectedAt: string;
}

export interface InventorySupplyChainPolicy {
  id: string;
  name: string;
  description: string;
  minimumReliabilityScore: number;
  defaultSafetyStock: number;
  autoReorderEnabled: boolean;
  status: InventorySupplyChainStatus;
}

export interface InventorySupplyChainEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: InventorySupplyChainRiskLevel;
  createdAt: string;
  metadata?: Record<string, unknown>;
}