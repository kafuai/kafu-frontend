import { appConfig } from "./appConfig";
import { featureFlags } from "./featureFlags";
import { foundationRegistry } from "./foundationRegistry";
import { handleError } from "./errorHandler";
import { logger } from "./logger";
import { SERVICE_KEYS } from "./serviceKeys";
import { serviceContainer } from "./serviceContainer";

export function registerFoundationServices() {
  if (!serviceContainer.has(SERVICE_KEYS.LOGGER)) {
    serviceContainer.register(SERVICE_KEYS.LOGGER, logger);
  }

  if (!serviceContainer.has(SERVICE_KEYS.ERROR_HANDLER)) {
    serviceContainer.register(SERVICE_KEYS.ERROR_HANDLER, handleError);
  }

  if (!serviceContainer.has(SERVICE_KEYS.APP_CONFIG)) {
    serviceContainer.register(SERVICE_KEYS.APP_CONFIG, appConfig);
  }

  if (!serviceContainer.has(SERVICE_KEYS.FEATURE_FLAGS)) {
    serviceContainer.register(SERVICE_KEYS.FEATURE_FLAGS, featureFlags);
  }

  if (!serviceContainer.has(SERVICE_KEYS.FOUNDATION_REGISTRY)) {
    serviceContainer.register(SERVICE_KEYS.FOUNDATION_REGISTRY, foundationRegistry);
  }
}