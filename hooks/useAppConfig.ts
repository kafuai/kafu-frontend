"use client";

import { useFoundation } from "@/components/foundation/FoundationContext";

export function useAppConfig() {
  const { config } = useFoundation();

  return config;
}