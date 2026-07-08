export type SupplierRelationshipStatus =
  | "draft"
  | "active"
  | "under_review"
  | "improvement_required"
  | "suspended"
  | "terminated";

export type SupplierTier =
  | "strategic"
  | "preferred"
  | "approved"
  | "conditional"
  | "restricted";

export type SupplierRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SupplierRelationshipHealth =
  | "excellent"
  | "healthy"
  | "watch"
  | "at_risk"
  | "critical";

export interface SupplierRelationship {
  id: string;
  supplierId: string;
  supplierName: string;
  ownerId: string;
  tier: SupplierTier;
  status: SupplierRelationshipStatus;
  health: SupplierRelationshipHealth;
  riskLevel: SupplierRiskLevel;
  startedAt: string;
  updatedAt: string;
}

export interface SupplierKpi {
  id: string;
  supplierId: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  measuredAt: string;
}

export interface SupplierScorecard {
  supplierId: string;
  performanceScore: number;
  complianceScore: number;
  riskScore: number;
  collaborationScore: number;
  overallScore: number;
  generatedAt: string;
}
export interface SupplierRelationshipReport {
  supplierId: string;
  summary: string;
  health: SupplierRelationshipHealth;
  recommendations: string[];
  generatedAt: string;
}
