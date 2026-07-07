import {
  ProcurementAmount,
  ProcurementOwner,
  ProcurementPriority,
  ProcurementStatus,
} from "./procurementTypes";

export interface ProcurementRequest {
  id: string;
  title: string;
  requester: ProcurementOwner;
  amount: ProcurementAmount;
  priority: ProcurementPriority;
  status: ProcurementStatus;
  createdAt: string;
}