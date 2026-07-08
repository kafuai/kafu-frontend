import type { SupplierRelationship } from "./supplierRelationshipTypes";

export interface SupplierRelationshipManager {
  managerId: string;
  supplierRelationships: SupplierRelationship[];
}

export function assignSupplierRelationship(
  manager: SupplierRelationshipManager,
  relationship: SupplierRelationship
): SupplierRelationshipManager {
  return {
    ...manager,
    supplierRelationships: [
      ...manager.supplierRelationships,
      relationship,
    ],
  };
}

export function countManagedSuppliers(
  manager: SupplierRelationshipManager
): number {
  return manager.supplierRelationships.length;
}
