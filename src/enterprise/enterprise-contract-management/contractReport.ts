export interface ContractReport {
  id: string;
  generatedAt: string;
  generatedBy: string;
  format: "pdf" | "xlsx" | "json";
}
