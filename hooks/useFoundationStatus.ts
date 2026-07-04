"use client";

import { useFoundation } from "@/components/foundation/FoundationContext";

export function useFoundationStatus() {
  const { registry } = useFoundation();

  return {
    appName: registry.appName,
    version: registry.version,
    environment: registry.environment,
    isEnterprise: registry.mode === "enterprise",
    isActive: registry.status === "active",
  };
}