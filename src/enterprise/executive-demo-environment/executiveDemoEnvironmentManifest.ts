import type { ExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentTypes";
import { buildExecutiveDemoEnvironmentBundle } from "./executiveDemoEnvironmentBundle";
import { buildExecutiveDemoEnvironmentSummary } from "./executiveDemoEnvironmentSummary";
import { resolveExecutiveDemoEnvironmentCapabilities } from "./executiveDemoEnvironmentCapabilities";
import { evaluateExecutiveDemoEnvironmentLaunchGate } from "./executiveDemoEnvironmentLaunchGate";

export interface ExecutiveDemoEnvironmentManifest {
  version: string;
  environmentId: string;
  generatedAt: string;
  summary: ReturnType<
    typeof buildExecutiveDemoEnvironmentSummary
  >;
  capabilities: ReturnType<
    typeof resolveExecutiveDemoEnvironmentCapabilities
  >;
  launchGate: ReturnType<
    typeof evaluateExecutiveDemoEnvironmentLaunchGate
  >;
}

export function buildExecutiveDemoEnvironmentManifest(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentManifest {
  const bundle =
    buildExecutiveDemoEnvironmentBundle(configuration);

  return {
    version: "1.0.0",
    environmentId: configuration.runtime.environmentId,
    generatedAt: new Date().toISOString(),
    summary: buildExecutiveDemoEnvironmentSummary({
      environmentId: bundle.context.environmentId,
      audience: bundle.context.audience,
      dataMode: bundle.context.dataMode,
      readinessScore: bundle.readiness.score,
      ready: bundle.readiness.ready,
      healthStatus: bundle.health.overallStatus,
      enabledCapabilities:
        bundle.snapshot.enabledCapabilities,
    }),
    capabilities:
      resolveExecutiveDemoEnvironmentCapabilities(configuration),
    launchGate:
      evaluateExecutiveDemoEnvironmentLaunchGate(configuration),
  };
}
