"use client";

import { useEffect, useState } from "react";

import { getSalesIntelligenceSnapshot } from "@/src/enterprise/sales-intelligence/salesIntelligenceRepository";
import type { SalesIntelligenceSnapshot } from "@/src/enterprise/sales-intelligence/salesIntelligenceTypes";

type SalesIntelligenceState = {
  snapshot: SalesIntelligenceSnapshot | null;
  loading: boolean;
  error: string;
};

export function useSalesIntelligence(): SalesIntelligenceState {
  const [state, setState] = useState<SalesIntelligenceState>({
    snapshot: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSalesIntelligence() {
      try {
        const snapshot = await getSalesIntelligenceSnapshot();

        if (!isMounted) {
          return;
        }

        setState({
          snapshot,
          loading: false,
          error: "",
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          snapshot: null,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "حدث خطأ غير متوقع أثناء تحميل ذكاء المبيعات.",
        });
      }
    }

    void loadSalesIntelligence();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
