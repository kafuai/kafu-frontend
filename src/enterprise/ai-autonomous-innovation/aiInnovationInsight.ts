import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export interface AIInnovationInsight {
  opportunityId: string;
  title: string;
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  score: number;
  generatedAt: Date;
}

export function generateAIInnovationInsight(
  opportunity: AIInnovationOpportunity,
): AIInnovationInsight {
  const score = scoreAIInnovationOpportunity(opportunity).totalScore;

  const strengths: string[] = [];
  const concerns: string[] = [];
  const recommendations: string[] = [];

  if (score >= 0.75) {
    strengths.push("High overall innovation potential.");
  }

  if (opportunity.impact.customerValue >= 0.7) {
    strengths.push("Strong customer value.");
  }

  if (opportunity.feasibility.implementationEffort > 0.7) {
    concerns.push("Implementation effort is high.");
    recommendations.push("Reduce implementation scope.");
  }

  if (opportunity.riskLevel === "high" || opportunity.riskLevel === "critical") {
    concerns.push("Innovation risk requires governance.");
    recommendations.push("Run a controlled pilot.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Proceed with experimentation.");
  }

  return {
    opportunityId: opportunity.id,
    title: opportunity.title,
    summary: `Innovation score: ${score.toFixed(2)}`,
    strengths,
    concerns,
    recommendations,
    score,
    generatedAt: new Date(),
  };
}