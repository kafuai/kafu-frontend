import type {
  ExecutiveDemoEnvironmentConfiguration,
  ExecutiveDemoEnvironmentStatus,
} from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoEnvironmentReadinessCheck {
  key: string;
  label: string;
  passed: boolean;
  status: ExecutiveDemoEnvironmentStatus;
  message: string;
}

export interface ExecutiveDemoEnvironmentReadinessResult {
  ready: boolean;
  score: number;
  checks: ExecutiveDemoEnvironmentReadinessCheck[];
}

export function assessExecutiveDemoEnvironmentReadiness(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentReadinessResult {
  const checks: ExecutiveDemoEnvironmentReadinessCheck[] = [
    {
      key: "runtime",
      label: "Runtime availability",
      passed: configuration.runtime.status === "ready",
      status: configuration.runtime.status,
      message: `Runtime status is ${configuration.runtime.status}.`,
    },
    {
      key: "narrative",
      label: "Executive narrative",
      passed: configuration.features.enableExecutiveNarrative,
      status: configuration.features.enableExecutiveNarrative
        ? "ready"
        : "degraded",
      message: configuration.features.enableExecutiveNarrative
        ? "Executive narrative is enabled."
        : "Executive narrative is disabled.",
    },
    {
      key: "presentation",
      label: "Guided presentation",
      passed: configuration.features.enableGuidedPresentation,
      status: configuration.features.enableGuidedPresentation
        ? "ready"
        : "degraded",
      message: configuration.features.enableGuidedPresentation
        ? "Guided presentation is enabled."
        : "Guided presentation is disabled.",
    },
    {
      key: "orchestration",
      label: "Autonomous orchestration",
      passed: configuration.features.enableAutonomousOrchestration,
      status: configuration.features.enableAutonomousOrchestration
        ? "ready"
        : "degraded",
      message: configuration.features.enableAutonomousOrchestration
        ? "Autonomous orchestration is enabled."
        : "Autonomous orchestration is disabled.",
    },
    {
      key: "data",
      label: "Data availability",
      passed:
        configuration.runtime.dataMode !== "live" ||
        configuration.features.enableLiveData,
      status:
        configuration.runtime.dataMode !== "live" ||
        configuration.features.enableLiveData
          ? "ready"
          : "unavailable",
      message:
        configuration.runtime.dataMode === "live" &&
        !configuration.features.enableLiveData
          ? "Live data mode requires live data to be enabled."
          : `Data mode ${configuration.runtime.dataMode} is available.`,
    },
    {
      key: "fallback",
      label: "Synthetic fallback",
      passed:
        configuration.runtime.status === "ready" ||
        configuration.features.enableSyntheticFallback,
      status:
        configuration.runtime.status === "ready" ||
        configuration.features.enableSyntheticFallback
          ? "ready"
          : "unavailable",
      message: configuration.features.enableSyntheticFallback
        ? "Synthetic fallback is enabled."
        : "Synthetic fallback is disabled.",
    },
  ];

  const passedChecks = checks.filter((check) => check.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  return {
    ready: checks.every((check) => check.status !== "unavailable"),
    score,
    checks,
  };
}
