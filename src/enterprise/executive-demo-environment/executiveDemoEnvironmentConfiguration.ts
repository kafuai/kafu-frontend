import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentMode,
} from "./executiveDemoEnvironmentTypes";

const defaultFeatureFlags = {
  enableLiveData: false,
  enableSyntheticFallback: true,
  enableExecutiveNarrative: true,
  enableGuidedPresentation: true,
  enableAutonomousOrchestration: true,
  enableTelemetry: false,
} as const;

export function createExecutiveDemoEnvironmentConfiguration(
  mode: ExecutiveDemoEnvironmentMode = "development",
): ExecutiveDemoEnvironmentConfiguration {
  const isProduction = mode === "production";
  const isOffline = mode === "offline";

  return {
    runtime: {
      environmentId: `kafu-executive-demo-${mode}`,
      mode,
      status: "ready",
      dataMode: isProduction ? "hybrid" : "synthetic",
      audience: "executive",
      sessionTimeoutMinutes: isProduction ? 60 : 120,
    },
    branding: {
      organizationName: "KAFU AI",
      productName: "KAFU AI Enterprise Intelligence Platform",
      logoUrl: null,
      primaryLocale: "ar",
      supportedLocales: ["ar", "en"],
    },
    features: {
      ...defaultFeatureFlags,
      enableLiveData: isProduction && !isOffline,
      enableTelemetry: isProduction && !isOffline,
    },
  };
}

export const defaultExecutiveDemoEnvironment =
  createExecutiveDemoEnvironmentConfiguration();
