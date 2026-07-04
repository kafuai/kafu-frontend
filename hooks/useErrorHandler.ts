"use client";

import { handleError } from "@/lib/foundation/errorHandler";

export function useErrorHandler() {
  return handleError;
}