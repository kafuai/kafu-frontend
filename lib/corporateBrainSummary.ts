import type { CorporateBrain } from "@/types/corporateBrainModel";

export function generateCorporateBrainSummary(
  brain: CorporateBrain
): string {
  const companyName = brain.dna.company.name || "هذه الشركة";

  return `${companyName} لديها مستوى ذكاء مؤسسي ${brain.intelligenceScore}%، مع جاهزية قرار "${brain.decisionReadiness}". التركيز الاستراتيجي الحالي يجب أن يكون على ${brain.strategicFocus.join(
    ", "
  )}.`;
}