import type { Copy } from "./copy";
import type { UnifiedRequest } from "./types";

export function shortRef(r: UnifiedRequest): string {
  const short = r.id.replace(/-/g, "").slice(-6).toUpperCase();
  return `${r.source === "attendance_corrections" ? "ATT" : "REQ"}-${short}`;
}

export function typeLabel(r: UnifiedRequest, copy: Copy): string {
  if (r.group === "attendance") return copy.types[r.correctionType] ?? r.correctionType;
  return copy.types[r.group];
}

/** Riyadh is UTC+3 with no DST. */
export function dayStart(key: string): number {
  return Date.parse(`${key}T00:00:00+03:00`);
}
export function dayEnd(key: string): number {
  return Date.parse(`${key}T23:59:59.999+03:00`);
}