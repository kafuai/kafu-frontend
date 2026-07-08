export interface CompensationAnalysis {
  averageSalary: number;
  totalCost: number;
  employeeCount: number;
}

export function calculateAverageCompensation(
  analysis: CompensationAnalysis
): number {
  return analysis.employeeCount
    ? Math.round(
        analysis.totalCost /
          analysis.employeeCount
      )
    : 0;
}
