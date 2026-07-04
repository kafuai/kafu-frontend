"use client";

import { createContext, useContext } from "react";
import { appConfig } from "@/lib/foundation/appConfig";
import { foundationRegistry } from "@/lib/foundation/foundationRegistry";
import { featureFlags } from "@/lib/foundation/featureFlags";
import { logger } from "@/lib/foundation/logger";

type FoundationContextValue = {
  config: typeof appConfig;
  registry: typeof foundationRegistry;
  features: typeof featureFlags;
  logger: typeof logger;
};

const FoundationContext = createContext<FoundationContextValue>({
  config: appConfig,
  registry: foundationRegistry,
  features: featureFlags,
  logger,
});

export function FoundationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FoundationContext.Provider
      value={{
        config: appConfig,
        registry: foundationRegistry,
        features: featureFlags,
        logger,
      }}
    >
      {children}
    </FoundationContext.Provider>
  );
}

export function useFoundation() {
  return useContext(FoundationContext);
}