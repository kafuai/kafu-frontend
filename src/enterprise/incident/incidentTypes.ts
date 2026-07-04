export type IncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type IncidentStatus =
  | "open"
  | "acknowledged"
  | "investigating"
  | "mitigated"
  | "resolved"
  | "closed";

export type IncidentSource =
  | "monitoring"
  | "alert"
  | "runtime"
  | "service"
  | "user"
  | "system"
  | "ai";

export type IncidentImpact =
  | "none"
  | "minor"
  | "major"
  | "severe";

export type Incident = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  impact: IncidentImpact;
  affectedServices: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
};

export type IncidentCreateInput = {
  organizationId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  source: IncidentSource;
  impact?: IncidentImpact;
  affectedServices?: string[];
  tags?: string[];
};