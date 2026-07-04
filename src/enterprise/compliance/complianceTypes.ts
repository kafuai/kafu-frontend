export type ComplianceSeverity = "low" | "medium" | "high" | "critical";

export type ComplianceStatus =
  | "compliant"
  | "partially_compliant"
  | "non_compliant"
  | "not_assessed";

export type ComplianceRequirementType =
  | "policy"
  | "process"
  | "technical_control"
  | "legal"
  | "security"
  | "privacy"
  | "operational"
  | "financial";

export type ComplianceControlType =
  | "preventive"
  | "detective"
  | "corrective"
  | "directive"
  | "compensating";

export interface ComplianceOwner {
  id: string;
  name: string;
  department?: string;
  email?: string;
}

export interface ComplianceMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: string;
  tags?: string[];
}

export interface ComplianceScope {
  regions?: string[];
  businessUnits?: string[];
  systems?: string[];
  services?: string[];
  dataCategories?: string[];
}

export interface ComplianceReference {
  id: string;
  title: string;
  source: string;
  url?: string;
  section?: string;
}