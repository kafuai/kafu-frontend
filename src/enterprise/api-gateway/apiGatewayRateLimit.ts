import { ApiGatewayRequest } from "./apiGatewayRequest";

export interface ApiGatewayRateLimitPolicy {
  id: string;
  organizationId: string;
  routeId: string;

  limit: number;
  windowMs: number;

  enabled: boolean;
}

export type ApiGatewayRateLimitResult =
  | {
      allowed: true;
      remaining: number;
    }
  | {
      allowed: false;
      retryAfterMs: number;
      reason: string;
    };

export function evaluateApiGatewayRateLimit(
  request: ApiGatewayRequest,
  policy?: ApiGatewayRateLimitPolicy,
): ApiGatewayRateLimitResult {
  if (!policy || !policy.enabled) {
    return {
      allowed: true,
      remaining: Number.MAX_SAFE_INTEGER,
    };
  }

  return {
    allowed: true,
    remaining: policy.limit,
  };
}