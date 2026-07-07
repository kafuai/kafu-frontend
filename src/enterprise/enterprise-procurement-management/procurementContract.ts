import { ProcurementPeriod } from "./procurementTypes";

export interface ProcurementContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  period: ProcurementPeriod;
  active: boolean;
}