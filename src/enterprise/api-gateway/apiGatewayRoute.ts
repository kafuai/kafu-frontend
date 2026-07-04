import { ApiGatewayRouteDefinition } from "./apiGatewayTypes";

export function createApiGatewayRoute(
  input: Omit<ApiGatewayRouteDefinition, "createdAt" | "updatedAt">,
): ApiGatewayRouteDefinition {
  const now = new Date();

  return {
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

export function isApiGatewayRouteActive(
  route: ApiGatewayRouteDefinition,
): boolean {
  return route.status === "active";
}