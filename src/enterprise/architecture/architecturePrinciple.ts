import {
  ArchitectureCriticality,
  ArchitectureLifecycleStatus,
} from "./architectureTypes";

export interface ArchitecturePrinciple {
  id: string;
  title: string;
  statement: string;
  rationale: string;
  implications: string[];
  owner: string;
  priority: ArchitectureCriticality;
  status: ArchitectureLifecycleStatus;
  appliesToDomains: string[];
}

export interface ArchitecturePrincipleEvaluation {
  principleId: string;
  compliant: boolean;
  evidence: string[];
  gaps: string[];
  recommendations: string[];
}

export function createArchitecturePrinciple(
  principle: ArchitecturePrinciple,
): ArchitecturePrinciple {
  return {
    ...principle,
    implications: [...principle.implications],
    appliesToDomains: [...principle.appliesToDomains],
  };
}

export function evaluateArchitecturePrinciple(
  principle: ArchitecturePrinciple,
  evidence: string[],
): ArchitecturePrincipleEvaluation {
  const compliant = evidence.length > 0;

  return {
    principleId: principle.id,
    compliant,
    evidence: [...evidence],
    gaps: compliant ? [] : [`No evidence found for principle: ${principle.title}`],
    recommendations: compliant
      ? []
      : [`Provide measurable implementation evidence for: ${principle.title}`],
  };
}