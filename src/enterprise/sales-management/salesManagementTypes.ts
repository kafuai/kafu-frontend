export type SalesManagementStatus =
  | "draft"
  | "active"
  | "paused"
  | "blocked"
  | "completed"
  | "archived";

export type SalesManagementPriority =
  | "low"
  | "medium"
  | "high"
  | "strategic";

export type SalesDealStage =
  | "identified"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type SalesQuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type SalesOrderStatus =
  | "created"
  | "confirmed"
  | "fulfilled"
  | "invoiced"
  | "cancelled";

export type SalesRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface SalesPipeline {
  id: string;
  name: string;
  description?: string;
  status: SalesManagementStatus;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesDeal {
  id: string;
  pipelineId: string;
  accountId: string;
  title: string;
  stage: SalesDealStage;
  estimatedValue: number;
  probability: number;
  priority: SalesManagementPriority;
  expectedCloseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesQuote {
  id: string;
  dealId: string;
  quoteNumber: string;
  status: SalesQuoteStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrder {
  id: string;
  quoteId: string;
  accountId: string;
  orderNumber: string;
  status: SalesOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesTarget {
  id: string;
  ownerId: string;
  period: string;
  targetAmount: number;
  achievedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesForecast {
  id: string;
  pipelineId: string;
  forecastAmount: number;
  confidence: number;
  horizonDays: number;
  generatedAt: string;
}

export interface SalesCommission {
  id: string;
  ownerId: string;
  dealId: string;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "approved" | "paid";
  createdAt: string;
  updatedAt: string;
}

export interface SalesTerritory {
  id: string;
  name: string;
  region?: string;
  ownerId?: string;
  accountIds: string[];
  status: SalesManagementStatus;
  updatedAt: string;
}

export interface SalesPolicy {
  id: string;
  name: string;
  description: string;
  minimumDealProbability: number;
  defaultCommissionRate: number;
  autoForecastEnabled: boolean;
  status: "active" | "inactive";
}

export interface SalesEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: SalesRiskLevel;
  createdAt: string;
  metadata?: Record<string, unknown>;
}