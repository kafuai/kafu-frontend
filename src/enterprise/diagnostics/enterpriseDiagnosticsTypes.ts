export type EnterpriseDiagnosticsSection = {
  name: string;
  status: "available" | "unavailable";
  data: Record<string, unknown>;
};

export type EnterpriseDiagnosticsReport = {
  generatedAt: string;
  sections: EnterpriseDiagnosticsSection[];
};