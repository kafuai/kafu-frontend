import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayResponse } from "./apiGatewayResponse";

export interface ApiGatewayCachePolicy {
  id: string;
  organizationId: string;
  routeId: string;

  enabled: boolean;
  ttlMs: number;

  varyByHeaders?: string[];
}

export interface ApiGatewayCacheEntry<TBody = unknown> {
  key: string;
  response: ApiGatewayResponse<TBody>;
  expiresAt: Date;
}

export function createApiGatewayCacheKey(
  request: ApiGatewayRequest,
  varyByHeaders: string[] = [],
): string {
  const headerParts = varyByHeaders.map(
    (header) => `${header}:${request.headers[header] ?? ""}`,
  );

  return [
    request.organizationId,
    request.method,
    request.path,
    JSON.stringify(request.query),
    ...headerParts,
  ].join("|");
}

export function isApiGatewayCacheEntryValid(
  entry: ApiGatewayCacheEntry,
): boolean {
  return entry.expiresAt.getTime() > Date.now();
}