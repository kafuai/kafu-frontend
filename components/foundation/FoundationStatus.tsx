"use client";

import { useFoundation } from "./FoundationContext";
import { useFoundationStatus } from "@/hooks/useFoundationStatus";

export default function FoundationStatus() {
  const foundation = useFoundationStatus();
  const { features } = useFoundation();

  if (!foundation.isActive || !features.debug) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur">
      {foundation.appName} · {foundation.version} · {foundation.environment}
    </div>
  );
}