import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentMode,
} from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoEnvironmentOverride {
  mode?: ExecutiveDemoEnvironmentMode;
  organizationName?: string;
  productName?: string;
  locale?: string;
  enableLiveData?: boolean;
  enableSyntheticFallback?: boolean;
  enableExecutiveNarrative?: boolean;
  enableGuidedPresentation?: boolean;
  enableAutonomousOrchestration?: boolean;
  enableTelemetry?: boolean;
  sessionTimeoutMinutes?: number;
}

export function applyExecutiveDemoEnvironmentOverride(
  configuration: ExecutiveDemoEnvironmentConfiguration,
  override: ExecutiveDemoEnvironmentOverride,
): ExecutiveDemoEnvironmentConfiguration {
  const resolvedLocale =
    override.locale?.trim() || configuration.branding.primaryLocale;

  const supportedLocales =
    configuration.branding.supportedLocales.includes(resolvedLocale)
      ? configuration.branding.supportedLocales
      : [...configuration.branding.supportedLocales, resolvedLocale];

  return {
    runtime: {
      ...configuration.runtime,
      mode: override.mode ?? configuration.runtime.mode,
      sessionTimeoutMinutes:
        override.sessionTimeoutMinutes ??
        configuration.runtime.sessionTimeoutMinutes,
    },
    branding: {
      ...configuration.branding,
      organizationName:
        override.organizationName?.trim() ||
        configuration.branding.organizationName,
      productName:
        override.productName?.trim() ||
        configuration.branding.productName,
      primaryLocale: resolvedLocale,
      supportedLocales,
    },
    features: {
      enableLiveData:
        override.enableLiveData ??
        configuration.features.enableLiveData,
      enableSyntheticFallback:
        override.enableSyntheticFallback ??
        configuration.features.enableSyntheticFallback,
      enableExecutiveNarrative:
        override.enableExecutiveNarrative ??
        configuration.features.enableExecutiveNarrative,
      enableGuidedPresentation:
        override.enableGuidedPresentation ??
        configuration.features.enableGuidedPresentation,
      enableAutonomousOrchestration:
        override.enableAutonomousOrchestration ??
        configuration.features.enableAutonomousOrchestration,
      enableTelemetry:
        override.enableTelemetry ??
        configuration.features.enableTelemetry,
    },
  };
}
