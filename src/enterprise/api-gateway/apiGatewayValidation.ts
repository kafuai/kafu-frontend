import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayRouteDefinition } from "./apiGatewayTypes";

export type ApiGatewayValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      errors: string[];
    };

export function validateApiGatewayRequest(
  request: ApiGatewayRequest,
  route: ApiGatewayRouteDefinition,
): ApiGatewayValidationResult {
  const errors: string[] = [];

  if (request.organizationId !== route.organizationId) {
    errors.push("Request organization does not match route organization.");
  }

  if (request.method !== route.method) {
    errors.push("Request method does not match route method.");
  }

  if (request.path !== route.path) {
    errors.push("Request path does not match route path.");
  }

  return errors.length === 0
    ? { valid: true }
    : {
        valid: false,
        errors,
      };
}