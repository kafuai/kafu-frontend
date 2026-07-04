import { ApiGatewayResponse } from "./apiGatewayResponse";

export interface ApiGatewayMetricsSnapshot {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTimeMs: number;
}

export function createApiGatewayMetricsSnapshot(
  responses: ApiGatewayResponse[],
  averageResponseTimeMs = 0,
): ApiGatewayMetricsSnapshot {
  const successfulRequests = responses.filter(
    (response) => response.success,
  ).length;

  return {
    totalRequests: responses.length,
    successfulRequests,
    failedRequests: responses.length - successfulRequests,
    averageResponseTimeMs,
  };
}