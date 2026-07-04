import { ApiGatewayRequest } from "./apiGatewayRequest";

export interface ApiGatewayReplayProtectionPolicy {
  id: string;
  organizationId: string;
  routeId: string;

  enabled: boolean;
  nonceHeaderName: string;
  timestampHeaderName: string;
  allowedClockSkewMs: number;
}

export type ApiGatewayReplayProtectionResult =
  | {
      valid: true;
      nonce: string;
      timestamp: Date;
    }
  | {
      valid: false;
      reason: string;
    };

export function validateApiGatewayReplayProtection(
  request: ApiGatewayRequest,
  policy?: ApiGatewayReplayProtectionPolicy,
): ApiGatewayReplayProtectionResult {
  if (!policy || !policy.enabled) {
    return {
      valid: true,
      nonce: "",
      timestamp: request.receivedAt,
    };
  }

  const nonce = request.headers[policy.nonceHeaderName];
  const timestampValue = request.headers[policy.timestampHeaderName];

  if (!nonce) {
    return {
      valid: false,
      reason: "Missing replay protection nonce.",
    };
  }

  if (!timestampValue) {
    return {
      valid: false,
      reason: "Missing replay protection timestamp.",
    };
  }

  const timestamp = new Date(timestampValue);

  if (Number.isNaN(timestamp.getTime())) {
    return {
      valid: false,
      reason: "Invalid replay protection timestamp.",
    };
  }

  const skew = Math.abs(Date.now() - timestamp.getTime());

  if (skew > policy.allowedClockSkewMs) {
    return {
      valid: false,
      reason: "Replay protection timestamp is outside allowed clock skew.",
    };
  }

  return {
    valid: true,
    nonce,
    timestamp,
  };
}