export interface SupplierRelationshipSummary {
  supplierId: string;
  score: number;
  health: string;
  actions: string[];
}

export function summarizeSupplierRelationship(
  summary: SupplierRelationshipSummary
): string {
  return `${summary.supplierId}: ${summary.health} (${summary.score})`;
}

export function requiresSupplierAction(
  summary: SupplierRelationshipSummary
): boolean {
  return summary.actions.length > 0;
}
