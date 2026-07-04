export type RiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RiskLikelihood =
  | "rare"
  | "unlikely"
  | "possible"
  | "likely"
  | "almost_certain";

export type RiskCategory =
  | "strategic"
  | "operational"
  | "financial"
  | "compliance"
  | "security"
  | "technology"
  | "reputation"
  | "vendor"
  | "environmental"
  | "custom";

export type RiskStatus =
  | "identified"
  | "assessing"
  | "active"
  | "mitigating"
  | "monitored"
  | "accepted"
  | "closed";

export type RiskImpactArea =
  | "cost"
  | "revenue"
  | "availability"
  | "customer_trust"
  | "legal"
  | "operations"
  | "data"
  | "people"
  | "delivery"
  | "brand";

export type RiskOwner = {
  id: string;
  name: string;
  role: string;
};

export type RiskImpact = {
  area: RiskImpactArea;
  description: string;
  severity: RiskSeverity;
  estimatedLoss?: number;
};

export type RiskSignal = {
  id: string;
  source: string;
  description: string;
  confidence: number;
  detectedAt: string;
};

export type RiskMetadata = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
};

export type EnterpriseRisk = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  status: RiskStatus;
  owner: RiskOwner;
  impacts: RiskImpact[];
  signals: RiskSignal[];
  metadata: RiskMetadata;
};