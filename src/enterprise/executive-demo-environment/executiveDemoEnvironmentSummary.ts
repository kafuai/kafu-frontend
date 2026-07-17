export interface ExecutiveDemoEnvironmentSummary {
  title: string;
  environment: string;
  audience: string;
  dataMode: string;
  readinessScore: number;
  ready: boolean;
  healthStatus: string;
  enabledCapabilities: number;
}

export function buildExecutiveDemoEnvironmentSummary(input: {
  environmentId: string;
  audience: string;
  dataMode: string;
  readinessScore: number;
  ready: boolean;
  healthStatus: string;
  enabledCapabilities: string[];
}): ExecutiveDemoEnvironmentSummary {
  return {
    title: "KAFU AI Executive Demo Environment",
    environment: input.environmentId,
    audience: input.audience,
    dataMode: input.dataMode,
    readinessScore: input.readinessScore,
    ready: input.ready,
    healthStatus: input.healthStatus,
    enabledCapabilities: input.enabledCapabilities.length,
  };
}
