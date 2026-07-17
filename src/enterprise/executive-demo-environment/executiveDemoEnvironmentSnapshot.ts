import type { ExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentTypes";

export interface ExecutiveDemoEnvironmentSnapshot {
  snapshotId: string;
  environmentId: string;
  mode: string;
  status: string;
  dataMode: string;
  audience: string;
  locale: string;
  organizationName: string;
  productName: string;
  enabledCapabilities: string[];
  createdAt: string;
}

export function createExecutiveDemoEnvironmentSnapshot(
  configuration: ExecutiveDemoEnvironmentConfiguration,
): ExecutiveDemoEnvironmentSnapshot {
  const enabledCapabilities = Object.entries(configuration.features)
    .filter(([, enabled]) => enabled)
    .map(([capability]) => capability);

  return {
    snapshotId: `${configuration.runtime.environmentId}-${Date.now()}`,
    environmentId: configuration.runtime.environmentId,
    mode: configuration.runtime.mode,
    status: configuration.runtime.status,
    dataMode: configuration.runtime.dataMode,
    audience: configuration.runtime.audience,
    locale: configuration.branding.primaryLocale,
    organizationName: configuration.branding.organizationName,
    productName: configuration.branding.productName,
    enabledCapabilities,
    createdAt: new Date().toISOString(),
  };
}
