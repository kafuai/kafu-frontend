export type ApiGatewayHealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy";

export interface ApiGatewayHealthSnapshot {
  status: ApiGatewayHealthStatus;

  activeRoutes: number;
  middlewareCount: number;

  timestamp: Date;
}

export function createApiGatewayHealthSnapshot(
  activeRoutes: number,
  middlewareCount: number,
): ApiGatewayHealthSnapshot {
  return {
    status: "healthy",
    activeRoutes,
    middlewareCount,
    timestamp: new Date(),
  };
}