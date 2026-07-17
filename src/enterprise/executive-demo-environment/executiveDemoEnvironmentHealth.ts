import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentStatus,
} from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoEnvironmentHealthSignal {
  key: string;
  status: ExecutiveDemoEnvironmentStatus;
  message: string;
}

export interface ExecutiveDemoEnvironmentHealthReport {
  environmentId: string;
  overallStatus: ExecutiveDemoEnvironmentStatus;
  signals: ExecutiveDemoEnvironmentHealthSignal[];
  generatedAt: string;
}

function resolveOverallStatus(
  signals: ExecutiveDemoEnvironmentHealthSignal[],
): ExecutiveDemoEnvironmentStatus {
  if (signals.some((signal) => signal.status === "unavailable")) {
    return "unavailable";
  }

  if (signals.some((signal) => signal.status === "degraded")) {
    return "degraded";
  }

  return "ready";
}

export function buildExecutiveDemoEnvironmentHealthReport(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentHealthReport {
  const signals: ExecutiveDemoEnvironmentHealthSignal[] = [
    {
      key: "runtime",
      status: configuration.runtime.status,
      message: `Runtime environment is ${configuration.runtime.status}.`,
    },
    {
      key: "data",
      status:
        configuration.runtime.dataMode === "live" &&
        !configuration.features.enableLiveData
          ? "degraded"
          : "ready",
      message:
        configuration.runtime.dataMode === "live" &&
        !configuration.features.enableLiveData
          ? "Live data mode is selected but live data is disabled."
          : `Data mode is ${configuration.runtime.dataMode}.`,
    },
    {
      key: "fallback",
      status:
        configuration.runtime.status !== "ready" &&
        !configuration.features.enableSyntheticFallback
          ? "unavailable"
          : "ready",
      message: configuration.features.enableSyntheticFallback
        ? "Synthetic fallback is available."
        : "Synthetic fallback is disabled.",
    },
    {
      key: "presentation",
      status: configuration.features.enableGuidedPresentation
        ? "ready"
        : "degraded",
      message: configuration.features.enableGuidedPresentation
        ? "Guided presentation is enabled."
        : "Guided presentation is disabled.",
    },
    {
      key: "orchestration",
      status: configuration.features.enableAutonomousOrchestration
        ? "ready"
        : "degraded",
      message: configuration.features.enableAutonomousOrchestration
        ? "Autonomous orchestration is enabled."
        : "Autonomous orchestration is disabled.",
    },
  ];

  return {
    environmentId: configuration.runtime.environmentId,
    overallStatus: resolveOverallStatus(signals),
    signals,
    generatedAt: new Date().toISOString(),
  };
}
