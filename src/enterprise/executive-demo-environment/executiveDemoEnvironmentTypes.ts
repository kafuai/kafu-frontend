export type ExecutiveDemoEnvironmentMode =
  | "development"
  | "preview"
  | "production"
  | "offline";

export type ExecutiveDemoEnvironmentStatus =
  | "ready"
  | "degraded"
  | "unavailable";

export type ExecutiveDemoAudienceType =
  | "executive"
  | "board"
  | "investor"
  | "client"
  | "internal";

export type ExecutiveDemoDataMode =
  | "synthetic"
  | "sample"
  | "live"
  | "hybrid";

export interface ExecutiveDemoEnvironmentFeatureFlags {
  enableLiveData: boolean;
  enableSyntheticFallback: boolean;
  enableExecutiveNarrative: boolean;
  enableGuidedPresentation: boolean;
  enableAutonomousOrchestration: boolean;
  enableTelemetry: boolean;
}

export interface ExecutiveDemoEnvironmentBranding {
  organizationName: string;
  productName: string;
  logoUrl?: string | null;
  primaryLocale: string;
  supportedLocales: string[];
}

export interface ExecutiveDemoEnvironmentRuntime {
  environmentId: string;
  mode: ExecutiveDemoEnvironmentMode;
  status: ExecutiveDemoEnvironmentStatus;
  dataMode: ExecutiveDemoDataMode;
  audience: ExecutiveDemoAudienceType;
  sessionTimeoutMinutes: number;
}

export interface ExecutiveDemoEnvironmentConfiguration {
  runtime: ExecutiveDemoEnvironmentRuntime;
  branding: ExecutiveDemoEnvironmentBranding;
  features: ExecutiveDemoEnvironmentFeatureFlags;
}

export interface ExecutiveDemoEnvironmentValidationIssue {
  field: string;
  message: string;
  severity: "warning" | "error";
}

export interface ExecutiveDemoEnvironmentValidationResult {
  valid: boolean;
  issues: ExecutiveDemoEnvironmentValidationIssue[];
}
