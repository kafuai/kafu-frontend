import { SupportPriority } from "./customerSupportTypes";

export interface SlaPolicy {
  id: string;
  name: string;
  priority: SupportPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
}
