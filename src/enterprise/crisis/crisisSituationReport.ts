import { CrisisSeverity, CrisisStatus } from "./crisisTypes";

export type CrisisSituationReport = {
  id: string;
  crisisId: string;
  createdAt: string;
  createdBy: string;
  currentStatus: CrisisStatus;
  currentSeverity: CrisisSeverity;
  summary: string;
  knownImpacts: string[];
  actionsTaken: string[];
  nextActions: string[];
  blockers?: string[];
};

export function createCrisisSituationReport(
  report: Omit<CrisisSituationReport, "createdAt">,
): CrisisSituationReport {
  return {
    ...report,
    createdAt: new Date().toISOString(),
  };
}