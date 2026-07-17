export type FinalPolishStatus =
  | "not-started"
  | "in-progress"
  | "ready"
  | "blocked"
  | "approved";

export type FinalPolishCategory =
  | "visual-consistency"
  | "content-quality"
  | "responsive-layout"
  | "interaction"
  | "accessibility"
  | "navigation"
  | "branding"
  | "executive-experience";

export type FinalPolishPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type FinalPolishItemStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked"
  | "not-applicable";

export interface FinalPolishItem {
  id: string;
  title: string;
  description: string;
  category: FinalPolishCategory;
  priority: FinalPolishPriority;
  status: FinalPolishItemStatus;
  required: boolean;
  route?: string;
  notes?: string[];
  completedAt?: string;
}

export interface FinalPolishIssue {
  id: string;
  title: string;
  description: string;
  category: FinalPolishCategory;
  priority: FinalPolishPriority;
  resolved: boolean;
  resolution?: string;
  relatedItemId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface FinalPolishScore {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  blockedItems: number;
  requiredItems: number;
  completedRequiredItems: number;
  unresolvedIssues: number;
  criticalIssues: number;
  scorePercentage: number;
  polishReady: boolean;
}

export interface FinalPolishPlan {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  status: FinalPolishStatus;
  items: FinalPolishItem[];
  issues: FinalPolishIssue[];
  score: FinalPolishScore;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface FinalPolishPlanInput {
  organizationId: string;
  companyName: string;
  title?: string;
  items: FinalPolishItem[];
  issues?: FinalPolishIssue[];
}
