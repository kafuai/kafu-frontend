export type OperationRiskLevel = "none" | "low" | "medium" | "high" | "severe";

export const OPERATION_RISK_LEVELS: OperationRiskLevel[] = [
  "none",
  "low",
  "medium",
  "high",
  "severe",
];

export function getOperationRiskWeight(riskLevel: OperationRiskLevel): number {
  switch (riskLevel) {
    case "severe":
      return 5;
    case "high":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
    case "none":
      return 1;
  }
}