import type { DataCatalog } from "./dataCatalog";
import type { DataQualityRule } from "./dataQualityRule";

export interface DataGovernanceReport {
  generatedAt: string;
  catalogs: DataCatalog[];
  qualityRules: DataQualityRule[];
}

export const getCatalogCount = (
  report: DataGovernanceReport
): number => report.catalogs.length;

export const getQualityRuleCount = (
  report: DataGovernanceReport
): number => report.qualityRules.length;

export const getFailedQualityRules = (
  report: DataGovernanceReport
): DataQualityRule[] =>
  report.qualityRules.filter(rule => rule.status === "failed");
