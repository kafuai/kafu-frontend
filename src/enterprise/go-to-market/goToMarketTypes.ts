export type GoToMarketSegment =
  | "startup"
  | "sme"
  | "enterprise"
  | "government"
  | "education"
  | "healthcare"
  | "finance"
  | "retail"
  | "manufacturing";

export type GoToMarketChannel =
  | "direct_sales"
  | "partners"
  | "marketplace"
  | "content"
  | "events"
  | "referrals"
  | "outbound"
  | "inbound";

export type GoToMarketStage =
  | "research"
  | "positioning"
  | "validation"
  | "pre_launch"
  | "launch"
  | "growth"
  | "scale";

export type GoToMarketPriority = "low" | "medium" | "high" | "critical";

export type GoToMarketStatus =
  | "draft"
  | "ready"
  | "active"
  | "paused"
  | "completed"
  | "blocked";

export interface GoToMarketObjective {
  id: string;
  title: string;
  description: string;
  stage: GoToMarketStage;
  priority: GoToMarketPriority;
  targetSegment: GoToMarketSegment;
  successMetric: string;
}

export interface GoToMarketSignal {
  id: string;
  source: string;
  segment: GoToMarketSegment;
  channel: GoToMarketChannel;
  strength: number;
  confidence: number;
  summary: string;
}

export interface GoToMarketPlan {
  id: string;
  name: string;
  stage: GoToMarketStage;
  status: GoToMarketStatus;
  objectives: GoToMarketObjective[];
  signals: GoToMarketSignal[];
  createdAt: string;
  updatedAt: string;
}