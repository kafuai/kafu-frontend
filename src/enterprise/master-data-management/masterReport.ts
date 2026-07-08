import type { MasterEntity } from "./masterEntity";
import type { MasterRecord } from "./masterRecord";

export interface MasterReport {
  generatedAt: string;
  entities: MasterEntity[];
  records: MasterRecord[];
}

export const getEntityCount = (
  report: MasterReport
): number => report.entities.length;

export const getRecordCount = (
  report: MasterReport
): number => report.records.length;

export const getGoldenRecordCount = (
  report: MasterReport
): number =>
  report.records.filter(record => record.goldenRecord).length;
