import { ApiGatewayServiceEndpoint } from "./apiGatewayServiceDiscovery";

export type ApiGatewayLoadBalancingStrategy =
  | "first-healthy"
  | "weighted";

export function selectApiGatewayLoadBalancedEndpoint(
  endpoints: ApiGatewayServiceEndpoint[],
  strategy: ApiGatewayLoadBalancingStrategy = "first-healthy",
): ApiGatewayServiceEndpoint | undefined {
  if (endpoints.length === 0) {
    return undefined;
  }

  if (strategy === "weighted") {
    return [...endpoints].sort(
      (a, b) => (b.weight ?? 1) - (a.weight ?? 1),
    )[0];
  }

  return endpoints[0];
}