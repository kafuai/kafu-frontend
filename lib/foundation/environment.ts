export const environment = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "KAFU AI",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development",
  version: process.env.NEXT_PUBLIC_VERSION ?? "11.0.0",
  isDevelopment:
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development") === "development",
  isProduction:
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development") === "production",
} as const;