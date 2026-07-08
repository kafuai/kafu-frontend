import type { FPAAmount, FPABaseline, FPAStatus } from "./fpaTypes";

export interface FPABudgetLine {
  id: string;
  departmentId: string;
  category: string;
  planned: FPAAmount;
  actual?: FPAAmount;
  owner: string;
  status: FPAStatus;
}

export interface FPABudget {
  id: string;
  baseline: FPABaseline;
  lines: FPABudgetLine[];
  approvalOwner: string;
  status: FPAStatus;
}

export function calculateBudgetTotal(lines: FPABudgetLine[]): number {
  return lines.reduce((total, line) => total + line.planned.value, 0);
}

export function calculateBudgetUtilization(line: FPABudgetLine): number {
  if (!line.actual || line.planned.value === 0) return 0;
  return Number(((line.actual.value / line.planned.value) * 100).toFixed(2));
}
