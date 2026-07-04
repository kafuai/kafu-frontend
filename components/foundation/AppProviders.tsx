"use client";

import { ReactNode, useEffect } from "react";
import { bootstrapFoundation } from "@/lib/foundation/bootstrap";
import { FoundationProvider } from "./FoundationContext";
import FoundationStatus from "./FoundationStatus";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    bootstrapFoundation();
  }, []);

  return (
    <FoundationProvider>
      {children}
      <FoundationStatus />
    </FoundationProvider>
  );
}