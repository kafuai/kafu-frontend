export type ApiGatewayProtocol =
  | "http"
  | "https"
  | "grpc"
  | "websocket"
  | "graphql";

export type ApiGatewayMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

export type ApiGatewayRouteType =
  | "public"
  | "protected"
  | "internal";

export type ApiGatewayStatus =
  | "active"
  | "disabled"
  | "maintenance";

export interface ApiGatewayRouteDefinition {
  id: string;
  organizationId: string;

  name: string;
  path: string;
  method: ApiGatewayMethod;

  protocol: ApiGatewayProtocol;
  type: ApiGatewayRouteType;

  status: ApiGatewayStatus;

  middleware: string[];

  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

export interface ApiGatewayContext {
  organizationId: string;

  requestId: string;

  routeId: string;

  authenticated: boolean;

  principalId?: string;

  roles: string[];

  metadata?: Record<string, unknown>;
}