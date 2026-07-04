import {
  ApiGatewayMethod,
  ApiGatewayRouteDefinition,
} from "./apiGatewayTypes";
import { isApiGatewayRouteActive } from "./apiGatewayRoute";

export class ApiGatewayRouter {
  private routes = new Map<string, ApiGatewayRouteDefinition>();

  register(route: ApiGatewayRouteDefinition): void {
    this.routes.set(this.createRouteKey(route.method, route.path), route);
  }

  find(
    method: ApiGatewayMethod,
    path: string,
  ): ApiGatewayRouteDefinition | undefined {
    const route = this.routes.get(this.createRouteKey(method, path));

    if (!route || !isApiGatewayRouteActive(route)) {
      return undefined;
    }

    return route;
  }

  list(): ApiGatewayRouteDefinition[] {
    return Array.from(this.routes.values());
  }

  private createRouteKey(method: ApiGatewayMethod, path: string): string {
    return `${method}:${path}`;
  }
}