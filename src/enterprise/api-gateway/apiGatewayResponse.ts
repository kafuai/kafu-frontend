export type ApiGatewayResponseHeaders = Record<string, string>;

export interface ApiGatewayResponse<TBody = unknown> {
  requestId: string;

  statusCode: number;
  success: boolean;

  headers: ApiGatewayResponseHeaders;

  body: TBody;

  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  completedAt: Date;
}

export function createApiGatewayResponse<TBody>(
  requestId: string,
  statusCode: number,
  body: TBody,
  headers: ApiGatewayResponseHeaders = {},
): ApiGatewayResponse<TBody> {
  return {
    requestId,
    statusCode,
    success: statusCode >= 200 && statusCode < 400,
    headers,
    body,
    completedAt: new Date(),
  };
}