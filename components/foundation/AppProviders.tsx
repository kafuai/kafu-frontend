"use client";

import { type ReactNode, useEffect } from "react";

import { bootstrapFoundation } from "@/lib/foundation/bootstrap";

import { LocalizationProvider } from "../localization/LocalizationContext";
import { ThemeProvider } from "../theme/ThemeContext";
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
    <ThemeProvider>
      <LocalizationProvider>
        <FoundationProvider>
          {children}
          <FoundationStatus />
        </FoundationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}