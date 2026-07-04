export type BusinessStage =
  | "startup"
  | "growth"
  | "mature"
  | "transformation"
  | "enterprise"
  | "unknown";

export type LeadershipStyle =
  | "centralized"
  | "collaborative"
  | "data_driven"
  | "reactive"
  | "balanced"
  | "unknown";

export type OrganizationPattern =
  | "people_dependent"
  | "process_driven"
  | "technology_enabled"
  | "decision_bottleneck"
  | "commercial_friction"
  | "siloed"
  | "unknown";

export type TransformationPriority =
  | "hr_foundation"
  | "operations_efficiency"
  | "leadership_alignment"
  | "digital_maturity"
  | "risk_reduction"
  | "growth_enablement"
  | "data_quality"
  | "corporate_brain"
  | "executive_readiness";

export type CorporateTrait = {
  key: string;
  title: string;
  description: string;
  confidence: number;
};

export type CompanyProfile = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employeeCount: number | null;
};

export type CorporateDNA = {
  company: CompanyProfile;

  businessStage: BusinessStage;
  leadershipStyle: LeadershipStyle;
  organizationPattern: OrganizationPattern;

  maturityScore: number;
  aiConfidence: number;
  dataQualityScore: number;

  strengths: CorporateTrait[];
  risks: CorporateTrait[];
  priorities: TransformationPriority[];

  executiveSummary: string;
  recommendedPath: string;

  generatedAt: string;
};