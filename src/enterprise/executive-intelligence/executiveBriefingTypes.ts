import type {
  ExecutiveHealthStatus,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

export type ExecutiveBriefingPeriod =
  | "current"
  | "daily"
  | "weekly"
  | "monthly";

export type ExecutiveBriefingSectionType =
  | "overview"
  | "performance"
  | "risk"
  | "opportunity"
  | "execution"
  | "focus";

export interface ExecutiveBriefingMetric {
  id: string;
  label: string;
  value: string;
  status: ExecutiveHealthStatus;
  priority: ExecutiveKpiPriority;
}

export interface ExecutiveBriefingSection {
  id: string;
  type: ExecutiveBriefingSectionType;
  title: string;
  summary: string;
  items: string[];
  priority: ExecutiveKpiPriority;
}

export interface ExecutiveBriefingHighlight {
  id: string;
  title: string;
  description: string;
  status: ExecutiveHealthStatus;
}

export interface ExecutiveBriefingRisk {
  id: string;
  title: string;
  description: string;
  priority: ExecutiveKpiPriority;
  recommendedAction: string;
}

export interface ExecutiveBriefing {
  id: string;
  generatedAt: string;
  period: ExecutiveBriefingPeriod;
  title: string;
  headline: string;
  executiveSummary: string;
  organizationHealth: {
    score: number;
    status: ExecutiveHealthStatus;
  };
  metrics: ExecutiveBriefingMetric[];
  highlights: ExecutiveBriefingHighlight[];
  risks: ExecutiveBriefingRisk[];
  sections: ExecutiveBriefingSection[];
  immediatePriorities: string[];
}