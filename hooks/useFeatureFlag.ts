"use client";

import { useFoundation } from "@/components/foundation/FoundationContext";
import type { FeatureFlags } from "@/lib/foundation/featureFlags";

export function useFeatureFlag(feature: keyof FeatureFlags) {
  const { features } = useFoundation();

  return features[feature];
}