"use client";

import { useFoundation } from "@/components/foundation/FoundationContext";

export function useLogger() {
  const { logger } = useFoundation();

  return logger;
}