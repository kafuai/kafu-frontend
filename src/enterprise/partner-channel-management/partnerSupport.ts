export type PartnerSupportPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface PartnerSupportCase {
  id: string;
  partnerId: string;
  title: string;
  priority: PartnerSupportPriority;
  resolved: boolean;
}

export function resolvePartnerSupportCase(
  supportCase: PartnerSupportCase,
): PartnerSupportCase {
  return {
    ...supportCase,
    resolved: true,
  };
}
