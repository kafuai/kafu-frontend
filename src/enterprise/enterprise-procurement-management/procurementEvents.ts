export type ProcurementEventType =
  | "request_created"
  | "request_submitted"
  | "request_approved"
  | "request_rejected"
  | "purchase_order_created"
  | "vendor_registered"
  | "contract_created"
  | "risk_identified";

export interface ProcurementEvent {
  id: string;
  type: ProcurementEventType;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}