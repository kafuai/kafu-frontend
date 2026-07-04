import { ArchitecturePrinciple } from "./architecturePrinciple";

export interface ArchitectureGovernanceResult {
  compliant: boolean;
  evaluatedPrinciples: number;
  violations: string[];
}

export function evaluateArchitectureGovernance(
  principles: ArchitecturePrinciple[],
): ArchitectureGovernanceResult {
  const violations = principles
    .filter((principle) => principle.status !== "active")
    .map((principle) => principle.title);

  return {
    compliant: violations.length === 0,
    evaluatedPrinciples: principles.length,
    violations,
  };
}