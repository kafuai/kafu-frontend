export type CustomerRelationshipStatus =
  | "lead"
  | "prospect"
  | "active"
  | "at_risk"
  | "inactive"
  | "churned";

export type CustomerRelationshipPriority =
  | "low"
  | "medium"
  | "high"
  | "strategic";

export type CustomerRelationshipRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type CustomerRelationshipAccountType =
  | "individual"
  | "small_business"
  | "mid_market"
  | "enterprise"
  | "public_sector";

export type CustomerRelationshipLifecycleStage =
  | "awareness"
  | "qualified"
  | "evaluation"
  | "onboarding"
  | "adoption"
  | "expansion"
  | "renewal"
  | "retention";

export type CustomerRelationshipInteractionChannel =
  | "email"
  | "phone"
  | "meeting"
  | "chat"
  | "support_ticket"
  | "web"
  | "event";

export type CustomerRelationshipOpportunityStage =
  | "identified"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface CustomerRelationship {
  id: string;
  accountId: string;
  ownerId?: string;
  status: CustomerRelationshipStatus;
  priority: CustomerRelationshipPriority;
  healthScore: number;
  riskLevel: CustomerRelationshipRiskLevel;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  accountId: string;
  displayName: string;
  email?: string;
  phone?: string;
  role?: string;
  preferences?: Record<string, unknown>;
  updatedAt: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  type: CustomerRelationshipAccountType;
  industry?: string;
  region?: string;
  annualRevenue?: number;
  employeeCount?: number;
  status: CustomerRelationshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInteraction {
  id: string;
  accountId: string;
  profileId?: string;
  channel: CustomerRelationshipInteractionChannel;
  summary: string;
  sentimentScore: number;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerLifecycleState {
  id: string;
  accountId: string;
  stage: CustomerRelationshipLifecycleStage;
  enteredAt: string;
  nextMilestone?: string;
  notes?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, unknown>;
  accountIds: string[];
  updatedAt: string;
}

export interface CustomerOpportunity {
  id: string;
  accountId: string;
  title: string;
  stage: CustomerRelationshipOpportunityStage;
  estimatedValue: number;
  probability: number;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRelationshipPolicy {
  id: string;
  name: string;
  description: string;
  minimumHealthScore: number;
  strategicAccountThreshold: number;
  autoRiskDetectionEnabled: boolean;
  status: "active" | "inactive";
}

export interface CustomerRelationshipEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: CustomerRelationshipRiskLevel;
  createdAt: string;
  metadata?: Record<string, unknown>;
}