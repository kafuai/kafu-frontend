import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayResponse } from "./apiGatewayResponse";

export type ApiGatewayTransformationDirection =
  | "request"
  | "response";

export interface ApiGatewayTransformationRule {
  id: string;
  organizationId: string;
  routeId: string;

  direction: ApiGatewayTransformationDirection;
  enabled: boolean;

  description?: string;
}

export function applyApiGatewayRequestTransformations(
  request: ApiGatewayRequest,
  rules: ApiGatewayTransformationRule[],
): ApiGatewayRequest {
  const enabledRules = rules.filter(
    (rule) => rule.enabled && rule.direction === "request",
  );

  if (enabledRules.length === 0) {
    return request;
  }

  return {
    ...request,
    headers: {
      ...request.headers,
      "x-transformed-request": "true",
    },
  };
}

export function applyApiGatewayResponseTransformations<TBody>(
  response: ApiGatewayResponse<TBody>,
  rules: ApiGatewayTransformationRule[],
): ApiGatewayResponse<TBody> {
  const enabledRules = rules.filter(
    (rule) => rule.enabled && rule.direction === "response",
  );

  if (enabledRules.length === 0) {
    return response;
  }

  return {
    ...response,
    headers: {
      ...response.headers,
      "x-transformed-response": "true",
    },
  };
}