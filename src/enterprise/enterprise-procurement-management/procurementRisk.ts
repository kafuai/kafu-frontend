import { ProcurementPriority } from "./procurementTypes";

export interface ProcurementRisk {
  id: string;
  vendorId?: string;
  title: string;
  description: string;
  severity: ProcurementPriority;
  probability: number;
  impact: number;
  mitigationPlan?: string;
}