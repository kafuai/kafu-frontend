export interface LicenseReport {
  id: string;
  generatedAt: string;
  generatedBy: string;
  format: "pdf" | "xlsx" | "json";
}
