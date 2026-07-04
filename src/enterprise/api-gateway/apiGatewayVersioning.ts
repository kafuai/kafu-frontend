import { ApiGatewayRequest } from "./apiGatewayRequest";

export type ApiGatewayVersionSource =
  | "header"
  | "query"
  | "path"
  | "default";

export interface ApiGatewayVersioningConfig {
  defaultVersion: string;
  supportedVersions: string[];
  source: ApiGatewayVersionSource;
  headerName?: string;
  queryName?: string;
}

export type ApiGatewayVersionResolutionResult =
  | {
      resolved: true;
      version: string;
      source: ApiGatewayVersionSource;
    }
  | {
      resolved: false;
      reason: string;
    };

export function resolveApiGatewayVersion(
  request: ApiGatewayRequest,
  config: ApiGatewayVersioningConfig,
): ApiGatewayVersionResolutionResult {
  let version: string | undefined;

  if (config.source === "header") {
    version = request.headers[config.headerName ?? "x-api-version"];
  }

  if (config.source === "query") {
    const value = request.query[config.queryName ?? "version"];
    version = Array.isArray(value) ? value[0] : value;
  }

  if (config.source === "path") {
    version = request.path.split("/").find((part) => /^v\d+$/.test(part));
  }

  if (config.source === "default") {
    version = config.defaultVersion;
  }

  if (!version) {
    return {
      resolved: false,
      reason: "API version could not be resolved.",
    };
  }

  if (!config.supportedVersions.includes(version)) {
    return {
      resolved: false,
      reason: `Unsupported API version: ${version}`,
    };
  }

  return {
    resolved: true,
    version,
    source: config.source,
  };
}