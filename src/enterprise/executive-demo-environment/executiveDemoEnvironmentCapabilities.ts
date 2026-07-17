import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentStatus,
} from "./executiveDemoEnvironmentTypes";

export type ExecutiveDemoEnvironmentCapabilityStatus =
  | "enabled"
  | "disabled"
  | "restricted";

export interface ExecutiveDemoEnvironmentCapability {
  key: string;
  label: string;
  status: ExecutiveDemoEnvironmentCapabilityStatus;
  reason: string;
}

export interface ExecutiveDemoEnvironmentCapabilities {
  environmentId: string;
  capabilities: ExecutiveDemoEnvironmentCapability[];
  enabledCount: number;
  disabledCount: number;
  restrictedCount: number;
}

export function resolveExecutiveDemoEnvironmentCapabilities(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentCapabilities {
  const runtimeStatus: ExecutiveDemoEnvironmentStatus =
    configuration.runtime.status;

  const capabilities: ExecutiveDemoEnvironmentCapability[] = [
    {
      key: "live-data",
      label: "Live Data",
      status: configuration.features.enableLiveData
        ? runtimeStatus === "ready"
          ? "enabled"
          : "restricted"
        : "disabled",
      reason: configuration.features.enableLiveData
        ? runtimeStatus === "ready"
          ? "Live data is enabled and the runtime is ready."
          : "Live data is enabled but runtime availability is limited."
        : "Live data is disabled for this environment.",
    },
    {
      key: "synthetic-fallback",
      label: "Synthetic Fallback",
      status: configuration.features.enableSyntheticFallback
        ? "enabled"
        : "disabled",
      reason: configuration.features.enableSyntheticFallback
        ? "Synthetic fallback is available."
        : "Synthetic fallback is disabled.",
    },
    {
      key: "executive-narrative",
      label: "Executive Narrative",
      status: configuration.features.enableExecutiveNarrative
        ? "enabled"
        : "disabled",
      reason: configuration.features.enableExecutiveNarrative
        ? "Executive narrative generation is enabled."
        : "Executive narrative generation is disabled.",
    },
    {
      key: "guided-presentation",
      label: "Guided Presentation",
      status: configuration.features.enableGuidedPresentation
        ? "enabled"
        : "disabled",
      reason: configuration.features.enableGuidedPresentation
        ? "Guided presentation is enabled."
        : "Guided presentation is disabled.",
    },
    {
      key: "autonomous-orchestration",
      label: "Autonomous Orchestration",
      status: configuration.features.enableAutonomousOrchestration
        ? runtimeStatus === "unavailable"
          ? "restricted"
          : "enabled"
        : "disabled",
      reason: configuration.features.enableAutonomousOrchestration
        ? runtimeStatus === "unavailable"
          ? "Orchestration is configured but the runtime is unavailable."
          : "Autonomous orchestration is enabled."
        : "Autonomous orchestration is disabled.",
    },
    {
      key: "telemetry",
      label: "Telemetry",
      status: configuration.features.enableTelemetry
        ? "enabled"
        : "disabled",
      reason: configuration.features.enableTelemetry
        ? "Telemetry collection is enabled."
        : "Telemetry collection is disabled.",
    },
  ];

  return {
    environmentId: configuration.runtime.environmentId,
    capabilities,
    enabledCount: capabilities.filter(
      (capability) => capability.status === "enabled",
    ).length,
    disabledCount: capabilities.filter(
      (capability) => capability.status === "disabled",
    ).length,
    restrictedCount: capabilities.filter(
      (capability) => capability.status === "restricted",
    ).length,
  };
}
