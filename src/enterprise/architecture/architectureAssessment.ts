import { ArchitectureBlueprint } from "./architectureBlueprint";

export interface ArchitectureAssessment {
  blueprintId: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function assessArchitecture(
  blueprint: ArchitectureBlueprint,
): ArchitectureAssessment {
  const componentCount = blueprint.components.length;

  const score = Math.min(100, componentCount * 10);

  return {
    blueprintId: blueprint.id,
    score,
    strengths:
      componentCount > 0
        ? ["Architecture blueprint is defined."]
        : [],
    weaknesses:
      componentCount === 0
        ? ["No architecture components defined."]
        : [],
    recommendations:
      componentCount < 5
        ? ["Expand architecture component coverage."]
        : [],
  };
}