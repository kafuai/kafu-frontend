import type { ExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentTypes";
import { assessExecutiveDemoEnvironmentReadiness } from "./executiveDemoEnvironmentReadiness";
import { buildExecutiveDemoEnvironmentHealthReport } from "./executiveDemoEnvironmentHealth";
import { resolveExecutiveDemoEnvironmentCapabilities } from "./executiveDemoEnvironmentCapabilities";

export type ExecutiveDemoEnvironmentLaunchDecision =
  | "launch"
  | "launch-with-fallback"
  | "block";

export interface ExecutiveDemoEnvironmentLaunchGate {
  decision: ExecutiveDemoEnvironmentLaunchDecision;
  permitted: boolean;
  readinessScore: number;
  healthStatus: string;
  reasons: string[];
}

export function evaluateExecutiveDemoEnvironmentLaunchGate(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentLaunchGate {
  const readiness =
    assessExecutiveDemoEnvironmentReadiness(configuration);

  const health =
    buildExecutiveDemoEnvironmentHealthReport(configuration);

  const capabilities =
    resolveExecutiveDemoEnvironmentCapabilities(configuration);

  const reasons: string[] = [];

  if (!readiness.ready) {
    reasons.push("One or more required environment checks are unavailable.");
  }

  if (health.overallStatus === "unavailable") {
    reasons.push("The executive demo environment is unavailable.");
  }

  if (capabilities.restrictedCount > 0) {
    reasons.push(
      `${capabilities.restrictedCount} environment capabilities are restricted.`,
    );
  }

  if (
    health.overallStatus === "unavailable" &&
    !configuration.features.enableSyntheticFallback
  ) {
    return {
      decision: "block",
      permitted: false,
      readinessScore: readiness.score,
      healthStatus: health.overallStatus,
      reasons,
    };
  }

  if (
    readiness.score < 70 ||
    health.overallStatus === "unavailable"
  ) {
    return {
      decision: configuration.features.enableSyntheticFallback
        ? "launch-with-fallback"
        : "block",
      permitted: configuration.features.enableSyntheticFallback,
      readinessScore: readiness.score,
      healthStatus: health.overallStatus,
      reasons,
    };
  }

  if (
    health.overallStatus === "degraded" ||
    capabilities.restrictedCount > 0
  ) {
    return {
      decision: "launch-with-fallback",
      permitted: true,
      readinessScore: readiness.score,
      healthStatus: health.overallStatus,
      reasons,
    };
  }

  return {
    decision: "launch",
    permitted: true,
    readinessScore: readiness.score,
    healthStatus: health.overallStatus,
    reasons: ["Executive demo environment is ready for launch."],
  };
}
