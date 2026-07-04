import { environment } from "./environment";

export const foundationRegistry = {
  appName: environment.appName,
  layer: "Foundation Layer",
  version: environment.version,
  status: "active",
  mode: "enterprise",
  environment: environment.environment,
} as const;

export type FoundationRegistry = typeof foundationRegistry;