import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayResponse } from "./apiGatewayResponse";

export interface ApiGatewayAuditRecord {
  id: string;
  organizationId: string;

  requestId: string;
  method: string;
  path: string;

  statusCode: number;
  success: boolean;

  principalId?: string;

  createdAt: Date;
}

export function createApiGatewayAuditRecord(
  request: ApiGatewayRequest,
  response: ApiGatewayResponse,
  principalId?: string,
): ApiGatewayAuditRecord {
  return {
    id: `${request.id}:${Date.now()}`,
    organizationId: request.organizationId,
    requestId: request.id,
    method: request.method,
    path: request.path,
    statusCode: response.statusCode,
    success: response.success,
    principalId,
    createdAt: new Date(),
  };
}