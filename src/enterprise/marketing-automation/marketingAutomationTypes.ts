export type MarketingChannelType =
  | "email"
  | "sms"
  | "social"
  | "web"
  | "ads"
  | "events"
  | "partner"
  | "in_app";

export type MarketingCampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type MarketingPriority = "low" | "medium" | "high" | "critical";

export type MarketingAutomationStatus =
  | "inactive"
  | "active"
  | "paused"
  | "failed"
  | "completed";

export type MarketingConsentStatus =
  | "unknown"
  | "opted_in"
  | "opted_out"
  | "restricted";

export type MarketingAudience = {
  id: string;
  name: string;
  description?: string;
  estimatedSize: number;
  consentStatus: MarketingConsentStatus;
  tags: string[];
};

export type MarketingSegment = {
  id: string;
  audienceId: string;
  name: string;
  criteria: string[];
  estimatedSize: number;
  priority: MarketingPriority;
};

export type MarketingCampaign = {
  id: string;
  name: string;
  objective: string;
  status: MarketingCampaignStatus;
  channels: MarketingChannelType[];
  segmentIds: string[];
  budget?: number;
  startsAt?: string;
  endsAt?: string;
};

export type MarketingContentAsset = {
  id: string;
  title: string;
  format: "email_template" | "landing_page" | "ad_copy" | "social_post" | "message";
  channel: MarketingChannelType;
  approved: boolean;
};

export type MarketingJourneyStep = {
  id: string;
  name: string;
  channel: MarketingChannelType;
  delayHours?: number;
  contentAssetId?: string;
};

export type MarketingJourney = {
  id: string;
  campaignId: string;
  name: string;
  steps: MarketingJourneyStep[];
  active: boolean;
};

export type MarketingAutomationRule = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: MarketingAutomationStatus;
  priority: MarketingPriority;
};

export type MarketingPerformanceMetrics = {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
};

export type MarketingAutomationReport = {
  campaignId: string;
  performanceScore: number;
  conversionRate: number;
  roi: number;
  recommendations: string[];
};
