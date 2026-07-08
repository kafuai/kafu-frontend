import type { SupplierRelationship, SupplierRelationshipHealth } from "./supplierRelationshipTypes";

export function createSupplierRelationship(
  relationship: SupplierRelationship
): SupplierRelationship {
  return {
    ...relationship,
    updatedAt: new Date().toISOString(),
  };
}

export function updateSupplierRelationshipHealth(
  relationship: SupplierRelationship,
  health: SupplierRelationshipHealth
): SupplierRelationship {
  return {
    ...relationship,
    health,
    updatedAt: new Date().toISOString(),
  };
}

export function isSupplierRelationshipActive(
  relationship: SupplierRelationship
): boolean {
  return relationship.status === "active";
}
