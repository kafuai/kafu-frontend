export type PartnerType =
  | "reseller"
  | "referral"
  | "implementation"
  | "technology"
  | "consulting"
  | "msp";

export type PartnerStatus =
  | "prospect"
  | "onboarding"
  | "active"
  | "paused"
  | "suspended"
  | "terminated";

export type PartnerTier =
  | "registered"
  | "silver"
  | "gold"
  | "platinum"
  | "strategic";

export interface PartnerChannelSummary {
  partnerId: string;
  type: PartnerType;
  status: PartnerStatus;
  tier: PartnerTier;
  score: number;
}
