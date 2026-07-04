import { ApiGatewayRequest } from "./apiGatewayRequest";

export interface ApiGatewayTraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;

  requestId: string;
  organizationId: string;

  startedAt: Date;
  endedAt?: Date;
}

export function createApiGatewayTraceContext(
  request: ApiGatewayRequest,
  parentSpanId?: string,
): ApiGatewayTraceContext {
  return {
    traceId: request.headers["x-trace-id"] ?? request.id,
    spanId: `${request.id}:gateway`,
    parentSpanId,
    requestId: request.id,
    organizationId: request.organizationId,
    startedAt: new Date(),
  };
}

export function completeApiGatewayTraceContext(
  trace: ApiGatewayTraceContext,
): ApiGatewayTraceContext {
  return {
    ...trace,
    endedAt: new Date(),
  };
}