import { ApiGatewayRequest } from "./apiGatewayRequest";
import {
  ApiGatewayResponse,
  createApiGatewayResponse,
} from "./apiGatewayResponse";
import { ApiGatewayRouter } from "./apiGatewayRouter";
import {
  ApiGatewayContext,
  ApiGatewayRouteDefinition,
} from "./apiGatewayTypes";
import {
  authenticateApiGatewayRequest,
  applyApiGatewayAuthentication,
} from "./apiGatewayAuthentication";
import { authorizeApiGatewayRequest } from "./apiGatewayAuthorization";
import { validateApiGatewayRequest } from "./apiGatewayValidation";
import {
  ApiGatewayMiddleware,
  runApiGatewayMiddleware,
} from "./apiGatewayMiddleware";
import {
  ApiGatewayRateLimitPolicy,
  evaluateApiGatewayRateLimit,
} from "./apiGatewayRateLimit";

export class ApiGatewayEngine {
  constructor(
    private readonly router: ApiGatewayRouter,
    private readonly middleware: ApiGatewayMiddleware[] = [],
    private readonly rateLimitPolicies: ApiGatewayRateLimitPolicy[] = [],
  ) {}

  async handle(request: ApiGatewayRequest): Promise<ApiGatewayResponse> {
    const route = this.router.find(request.method, request.path);

    if (!route) {
      return createApiGatewayResponse(request.id, 404, {
        message: "API route not found.",
      });
    }

    const context = this.createContext(request, route);

    const authResult = authenticateApiGatewayRequest(request);
    const authenticatedContext = applyApiGatewayAuthentication(
      context,
      authResult,
    );

    const authorization = authorizeApiGatewayRequest(route, authenticatedContext);

    if (!authorization.authorized) {
      return createApiGatewayResponse(request.id, 403, {
        message: authorization.reason,
      });
    }

    const validation = validateApiGatewayRequest(request, route);

    if (!validation.valid) {
      return createApiGatewayResponse(request.id, 400, {
        errors: validation.errors,
      });
    }

    const rateLimit = evaluateApiGatewayRateLimit(
      request,
      this.findRateLimitPolicy(route),
    );

    if (!rateLimit.allowed) {
      return createApiGatewayResponse(request.id, 429, {
        message: rateLimit.reason,
        retryAfterMs: rateLimit.retryAfterMs,
      });
    }

    const middlewareResult = await runApiGatewayMiddleware(
      this.middleware,
      request,
      authenticatedContext,
    );

    if (!middlewareResult.continue) {
      return middlewareResult.response;
    }

    return createApiGatewayResponse(request.id, 200, {
      message: "API Gateway request accepted.",
      routeId: route.id,
    });
  }

  private createContext(
    request: ApiGatewayRequest,
    route: ApiGatewayRouteDefinition,
  ): ApiGatewayContext {
    return {
      organizationId: request.organizationId,
      requestId: request.id,
      routeId: route.id,
      authenticated: false,
      roles: [],
      metadata: {},
    };
  }

  private findRateLimitPolicy(
    route: ApiGatewayRouteDefinition,
  ): ApiGatewayRateLimitPolicy | undefined {
    return this.rateLimitPolicies.find((policy) => policy.routeId === route.id);
  }
}