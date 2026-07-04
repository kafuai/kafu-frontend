import { CrisisPlan } from "./crisisPlan";
import { CrisisResponseTeam } from "./crisisResponseTeam";

export type CrisisReadinessReview = {
  organizationId: string;
  reviewedAt: string;
  score: number;
  gaps: string[];
  ready: boolean;
};

export function reviewCrisisReadiness(
  organizationId: string,
  plans: CrisisPlan[],
  teams: CrisisResponseTeam[],
): CrisisReadinessReview {
  const gaps: string[] = [];
  let score = 100;

  const activePlans = plans.filter(
    (plan) => plan.organizationId === organizationId && plan.active,
  );

  const organizationTeams = teams.filter(
    (team) => team.organizationId === organizationId,
  );

  if (activePlans.length === 0) {
    score -= 40;
    gaps.push("No active crisis management plan found.");
  }

  if (organizationTeams.length === 0) {
    score -= 40;
    gaps.push("No crisis response team configured.");
  }

  if (
    organizationTeams.some(
      (team) => !team.members.some((member) => member.primary),
    )
  ) {
    score -= 20;
    gaps.push("At least one crisis response team has no primary member.");
  }

  const normalizedScore = Math.max(0, score);

  return {
    organizationId,
    reviewedAt: new Date().toISOString(),
    score: normalizedScore,
    gaps,
    ready: normalizedScore >= 80,
  };
}