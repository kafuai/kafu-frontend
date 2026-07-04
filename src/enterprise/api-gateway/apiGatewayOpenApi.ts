import { ApiGatewayRouteDefinition } from "./apiGatewayTypes";

export interface ApiGatewayOpenApiDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<
    string,
    Record<
      string,
      {
        operationId: string;
        summary: string;
      }
    >
  >;
}

export function generateApiGatewayOpenApiDocument(
  title: string,
  version: string,
  routes: ApiGatewayRouteDefinition[],
): ApiGatewayOpenApiDocument {
  const paths: ApiGatewayOpenApiDocument["paths"] = {};

  for (const route of routes) {
    const path = paths[route.path] ?? {};

    path[route.method.toLowerCase()] = {
      operationId: route.id,
      summary: route.name,
    };

    paths[route.path] = path;
  }

  return {
    openapi: "3.1.0",
    info: {
      title,
      version,
    },
    paths,
  };
}