export interface ContractRisk {
  id: string;
  contractId: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  mitigation?: string;
}
