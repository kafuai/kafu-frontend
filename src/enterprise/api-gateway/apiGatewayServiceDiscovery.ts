export interface ApiGatewayServiceEndpoint {
  id: string;
  organizationId: string;

  serviceName: string;
  routeId: string;

  url: string;
  healthy: boolean;

  weight?: number;
  metadata?: Record<string, unknown>;
}

export function findHealthyApiGatewayServiceEndpoints(
  endpoints: ApiGatewayServiceEndpoint[],
  routeId: string,
): ApiGatewayServiceEndpoint[] {
  return endpoints.filter(
    (endpoint) => endpoint.routeId === routeId && endpoint.healthy,
  );
}

export function selectApiGatewayServiceEndpoint(
  endpoints: ApiGatewayServiceEndpoint[],
): ApiGatewayServiceEndpoint | undefined {
  return endpoints.sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1))[0];
}