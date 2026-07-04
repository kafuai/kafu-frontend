import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayContext } from "./apiGatewayTypes";

export type ApiGatewayAuthenticationResult =
  | {
      authenticated: true;
      principalId: string;
      roles: string[];
    }
  | {
      authenticated: false;
      reason: string;
    };

export function authenticateApiGatewayRequest(
  request: ApiGatewayRequest,
): ApiGatewayAuthenticationResult {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return {
      authenticated: false,
      reason: "Missing authorization header.",
    };
  }

  return {
    authenticated: true,
    principalId: authorization.replace("Bearer ", ""),
    roles: [],
  };
}

export function applyApiGatewayAuthentication(
  context: ApiGatewayContext,
  result: ApiGatewayAuthenticationResult,
): ApiGatewayContext {
  if (!result.authenticated) {
    return {
      ...context,
      authenticated: false,
    };
  }

  return {
    ...context,
    authenticated: true,
    principalId: result.principalId,
    roles: result.roles,
  };
}