import type { ContractManagementRecord } from "./contractManagementTypes";

export interface Contract extends ContractManagementRecord {
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}
