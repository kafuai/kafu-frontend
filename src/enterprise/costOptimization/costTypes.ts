export type CostCurrency = "USD" | "JOD" | "EUR" | "GBP";

export type CostPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type CostCategory =
  | "compute"
  | "storage"
  | "network"
  | "database"
  | "ai"
  | "licensing"
  | "operations"
  | "support"
  | "security"
  | "other";

export type CostSeverity = "low" | "medium" | "high" | "critical";

export type CostStatus = "tracked" | "optimized" | "over_budget" | "unallocated";

export type CostResource = {
  id: string;
  organizationId: string;
  name: string;
  category: CostCategory;
  owner?: string;
  environment?: "development" | "staging" | "production";
  monthlyCost: number;
  currency: CostCurrency;
  tags?: Record<string, string>;
};

export type CostModel = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  period: CostPeriod;
  currency: CostCurrency;
  resources: CostResource[];
  createdAt: Date;
  updatedAt: Date;
};

export type CostAnalysisResult = {
  modelId: string;
  organizationId: string;
  totalCost: number;
  currency: CostCurrency;
  costByCategory: Record<CostCategory, number>;
  highestCategory: CostCategory | null;
  resourceCount: number;
  analyzedAt: Date;
};

export type CostAllocationResult = {
  organizationId: string;
  modelId: string;
  allocations: Array<{
    owner: string;
    totalCost: number;
    resourceIds: string[];
  }>;
  unallocatedCost: number;
  currency: CostCurrency;
  allocatedAt: Date;
};