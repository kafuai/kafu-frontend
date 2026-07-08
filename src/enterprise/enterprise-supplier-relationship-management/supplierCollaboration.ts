export interface SupplierCollaborationRecord {
  supplierId: string;
  initiatives: string[];
  sharedGoals: string[];
  lastInteraction: string;
}

export function addSupplierInitiative(
  record: SupplierCollaborationRecord,
  initiative: string
): SupplierCollaborationRecord {
  return {
    ...record,
    initiatives: [...record.initiatives, initiative],
    lastInteraction: new Date().toISOString(),
  };
}

export function hasSharedGoals(
  record: SupplierCollaborationRecord
): boolean {
  return record.sharedGoals.length > 0;
}
