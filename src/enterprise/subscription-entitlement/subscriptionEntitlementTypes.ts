export type SubscriptionStatus =
  | "trial"
  | "active"
  | "suspended"
  | "expired";

export type FeatureAccessLevel =
  | "none"
  | "read"
  | "write"
  | "admin";

export interface SubscriptionPlanModel {
  id: string;
  name: string;
  status: SubscriptionStatus;
  users: number;
}

export interface Entitlement {
  feature: string;
  access: FeatureAccessLevel;
}

export interface SubscriptionWorkspaceModel {
  plan: SubscriptionPlanModel;
  entitlements: Entitlement[];
}
