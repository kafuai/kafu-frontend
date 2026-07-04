"use client";

import { ReactNode } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import type { FeatureFlags } from "@/lib/foundation/featureFlags";

type FeatureGateProps = {
  feature: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  const isEnabled = useFeatureFlag(feature);

  if (!isEnabled) return <>{fallback}</>;

  return <>{children}</>;
}