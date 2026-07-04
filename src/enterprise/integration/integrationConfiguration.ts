export type IntegrationConfiguration = {
  integrationId: string;
  enabled: boolean;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  metadata?: Record<string, unknown>;
};

export function createIntegrationConfiguration(
  integrationId: string,
): IntegrationConfiguration {
  return {
    integrationId,
    enabled: true,
    timeoutMs: 30_000,
    retryAttempts: 3,
    retryDelayMs: 1_000,
  };
}