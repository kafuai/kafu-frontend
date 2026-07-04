import type { CorporateDNA } from "@/types/corporateDNA";
import type { ExecutiveMemory } from "@/types/corporateBrainModel";

export function buildExecutiveMemory(
  dna: CorporateDNA
): ExecutiveMemory {
  return {
    keyObservations: [
      `Business Stage: ${dna.businessStage}`,
      `Leadership Style: ${dna.leadershipStyle}`,
      `Organization Pattern: ${dna.organizationPattern}`,
    ],

    recurringPatterns: [
      ...dna.strengths.map((item) => item.title),
      ...dna.risks.map((item) => item.title),
    ],

    strategicConcerns: dna.priorities.map((priority) =>
      priority.replace(/_/g, " ")
    ),
  };
}