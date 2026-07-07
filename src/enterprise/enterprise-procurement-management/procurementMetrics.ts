import { ProcurementAmount } from "./procurementTypes";

export interface ProcurementMetrics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  activePurchaseOrders: number;
  totalSpend: ProcurementAmount;
  averageApprovalTimeHours: number;
}