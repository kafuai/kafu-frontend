import { environment } from "./environment";
import { featureFlags } from "./featureFlags";

export const appConfig = {
  name: environment.appName,
  version: environment.version,
  environment: environment.environment,
  mode: "enterprise",
  features: featureFlags,
  ui: {
    direction: "rtl",
    language: "ar",
    shell: "foundation",
  },
} as const;

export type AppConfig = typeof appConfig;