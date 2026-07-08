export type BenefitStatus =
  | "draft"
  | "active"
  | "suspended"
  | "retired";

export type BenefitCategory =
  | "health"
  | "financial"
  | "wellness"
  | "other";

export interface BenefitAdministrationProfile {
  id: string;
  organizationId: string;
  status: BenefitStatus;
  category: BenefitCategory;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitMetric {
  name: string;
  value: number;
  measuredAt: string;
}
