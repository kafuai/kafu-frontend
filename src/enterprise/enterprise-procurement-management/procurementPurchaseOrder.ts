import {
  ProcurementAmount,
  ProcurementStatus,
} from "./procurementTypes";

export interface ProcurementPurchaseOrder {
  id: string;
  requestId: string;
  vendorId: string;
  total: ProcurementAmount;
  status: ProcurementStatus;
  issuedAt: string;
}