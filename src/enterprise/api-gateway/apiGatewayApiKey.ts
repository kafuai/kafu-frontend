import { ApiGatewayRequest } from "./apiGatewayRequest";

export interface ApiGatewayApiKey {
  id: string;
  organizationId: string;

  key: string;
  name: string;

  active: boolean;

  roles: string[];

  createdAt: Date;
  expiresAt?: Date;
}

export type ApiGatewayApiKeyValidationResult =
  | {
      valid: true;
      apiKey: ApiGatewayApiKey;
    }
  | {
      valid: false;
      reason: string;
    };

export function validateApiGatewayApiKey(
  request: ApiGatewayRequest,
  apiKeys: ApiGatewayApiKey[],
): ApiGatewayApiKeyValidationResult {
  const key = request.headers["x-api-key"];

  if (!key) {
    return {
      valid: false,
      reason: "Missing API key.",
    };
  }

  const apiKey = apiKeys.find(
    (item) =>
      item.key === key &&
      item.organizationId === request.organizationId,
  );

  if (!apiKey) {
    return {
      valid: false,
      reason: "Invalid API key.",
    };
  }

  if (!apiKey.active) {
    return {
      valid: false,
      reason: "API key is inactive.",
    };
  }

  if (apiKey.expiresAt && apiKey.expiresAt.getTime() < Date.now()) {
    return {
      valid: false,
      reason: "API key is expired.",
    };
  }

  return {
    valid: true,
    apiKey,
  };
}