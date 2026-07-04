export type PlatformServiceStatus =
  | "idle"
  | "active"
  | "degraded"
  | "failed";

export type PlatformEnvironment =
  | "development"
  | "staging"
  | "production"
  | "test";

export type PlatformCapability =
  | "configuration"
  | "feature-flags"
  | "secrets"
  | "scheduling"
  | "background-jobs"
  | "cache"
  | "storage";

export type PlatformServiceHealth = {
  capability: PlatformCapability;
  status: PlatformServiceStatus;
  message?: string;
  checkedAt: Date;
};

export type PlatformServiceContext = {
  organizationId: string;
  environment: PlatformEnvironment;
  region?: string;
  requestId?: string;
};

export type PlatformOperationResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
};