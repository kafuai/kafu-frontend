export interface AssetReport {
  id: string;
  generatedAt: string;
  generatedBy: string;
  format: "pdf" | "xlsx" | "json";
}
