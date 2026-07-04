export const SERVICE_KEYS = {
  LOGGER: "logger",
  ERROR_HANDLER: "errorHandler",
  APP_CONFIG: "appConfig",
  FEATURE_FLAGS: "featureFlags",
  FOUNDATION_REGISTRY: "foundationRegistry",
} as const;

export type ServiceKey = (typeof SERVICE_KEYS)[keyof typeof SERVICE_KEYS];