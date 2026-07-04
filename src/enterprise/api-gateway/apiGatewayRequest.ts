import {
  ApiGatewayMethod,
  ApiGatewayProtocol,
} from "./apiGatewayTypes";

export type ApiGatewayRequestHeaders = Record<string, string>;

export type ApiGatewayRequestQuery = Record<string, string | string[]>;

export type ApiGatewayRequestBody = Record<string, unknown> | unknown[] | null;

export interface ApiGatewayRequest {
  id: string;
  organizationId: string;

  protocol: ApiGatewayProtocol;
  method: ApiGatewayMethod;
  path: string;

  headers: ApiGatewayRequestHeaders;
  query: ApiGatewayRequestQuery;
  body: ApiGatewayRequestBody;

  ipAddress?: string;
  userAgent?: string;

  receivedAt: Date;
}