import { ApiGatewayRequest } from "./apiGatewayRequest";
import { ApiGatewayResponse } from "./apiGatewayResponse";
import { ApiGatewayContext } from "./apiGatewayTypes";

export type ApiGatewayMiddlewareResult =
  | {
      continue: true;
      context?: Partial<ApiGatewayContext>;
    }
  | {
      continue: false;
      response: ApiGatewayResponse;
    };

export type ApiGatewayMiddleware = (
  request: ApiGatewayRequest,
  context: ApiGatewayContext,
) => ApiGatewayMiddlewareResult | Promise<ApiGatewayMiddlewareResult>;

export async function runApiGatewayMiddleware(
  middleware: ApiGatewayMiddleware[],
  request: ApiGatewayRequest,
  context: ApiGatewayContext,
): Promise<ApiGatewayMiddlewareResult> {
  let currentContext = { ...context };

  for (const item of middleware) {
    const result = await item(request, currentContext);

    if (!result.continue) {
      return result;
    }

    currentContext = {
      ...currentContext,
      ...result.context,
    };
  }

  return {
    continue: true,
    context: currentContext,
  };
}