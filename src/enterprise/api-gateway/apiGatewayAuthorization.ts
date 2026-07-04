import { ApiGatewayContext, ApiGatewayRouteDefinition } from "./apiGatewayTypes";

export type ApiGatewayAuthorizationResult =
  | {
      authorized: true;
    }
  | {
      authorized: false;
      reason: string;
    };

export function authorizeApiGatewayRequest(
  route: ApiGatewayRouteDefinition,
  context: ApiGatewayContext,
): ApiGatewayAuthorizationResult {
  if (route.type === "public") {
    return { authorized: true };
  }

  if (!context.authenticated) {
    return {
      authorized: false,
      reason: "Request is not authenticated.",
    };
  }

  return { authorized: true };
}