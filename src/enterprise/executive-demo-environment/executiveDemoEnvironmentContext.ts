import type {
  ExecutiveDemoAudienceType,
  ExecutiveDemoDataMode,
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentMode,
  ExecutiveDemoEnvironmentStatus,
} from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoEnvironmentContext {
  environmentId: string;
  mode: ExecutiveDemoEnvironmentMode;
  status: ExecutiveDemoEnvironmentStatus;
  audience: ExecutiveDemoAudienceType;
  dataMode: ExecutiveDemoDataMode;
  locale: string;
  organizationName: string;
  productName: string;
  liveDataEnabled: boolean;
  syntheticFallbackEnabled: boolean;
  executiveNarrativeEnabled: boolean;
  guidedPresentationEnabled: boolean;
  autonomousOrchestrationEnabled: boolean;
  telemetryEnabled: boolean;
  sessionTimeoutMinutes: number;
}

export function buildExecutiveDemoEnvironmentContext(
  configuration: ExecutiveDemoEnvironmentConfiguration,
  locale?: string,
): ExecutiveDemoEnvironmentContext {
  const requestedLocale =
    locale?.trim() || configuration.branding.primaryLocale;

  const resolvedLocale =
    configuration.branding.supportedLocales.includes(requestedLocale)
      ? requestedLocale
      : configuration.branding.primaryLocale;

  return {
    environmentId: configuration.runtime.environmentId,
    mode: configuration.runtime.mode,
    status: configuration.runtime.status,
    audience: configuration.runtime.audience,
    dataMode: configuration.runtime.dataMode,
    locale: resolvedLocale,
    organizationName: configuration.branding.organizationName,
    productName: configuration.branding.productName,
    liveDataEnabled: configuration.features.enableLiveData,
    syntheticFallbackEnabled:
      configuration.features.enableSyntheticFallback,
    executiveNarrativeEnabled:
      configuration.features.enableExecutiveNarrative,
    guidedPresentationEnabled:
      configuration.features.enableGuidedPresentation,
    autonomousOrchestrationEnabled:
      configuration.features.enableAutonomousOrchestration,
    telemetryEnabled: configuration.features.enableTelemetry,
    sessionTimeoutMinutes:
      configuration.runtime.sessionTimeoutMinutes,
  };
}
