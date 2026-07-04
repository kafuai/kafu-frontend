import { ApiGatewayAuditRecord } from "./apiGatewayAudit";

export interface ApiGatewayAnalyticsSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;

  routes: Record<
    string,
    {
      totalRequests: number;
      failedRequests: number;
    }
  >;
}

export function createApiGatewayAnalyticsSummary(
  records: ApiGatewayAuditRecord[],
): ApiGatewayAnalyticsSummary {
  const routes: ApiGatewayAnalyticsSummary["routes"] = {};

  for (const record of records) {
    if (!routes[record.path]) {
      routes[record.path] = {
        totalRequests: 0,
        failedRequests: 0,
      };
    }

    routes[record.path].totalRequests += 1;

    if (!record.success) {
      routes[record.path].failedRequests += 1;
    }
  }

  const successfulRequests = records.filter((record) => record.success).length;

  return {
    totalRequests: records.length,
    successfulRequests,
    failedRequests: records.length - successfulRequests,
    routes,
  };
}