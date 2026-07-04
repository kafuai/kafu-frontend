import { environment } from "./environment";

export const featureFlags = {
  foundation: true,
  executiveReports: true,
  corporateBrain: true,
  corporateDNA: true,
  printEngine: false,
  shareEngine: false,
  themeEngine: false,
  aiAgents: false,
  debug: environment.isDevelopment,
} as const;

export type FeatureFlags = typeof featureFlags;