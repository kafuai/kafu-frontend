import { AITrustLevel } from "./aiTrustTypes";
import { AITrustProfile } from "./aiTrustProfile";

export interface AITrustDashboardSummary {
  totalProfiles: number;
  averageTrustScore: number;
  profilesByLevel: Record<AITrustLevel, number>;
  lowTrustProfiles: string[];
  generatedAt: Date;
}

export function generateAITrustDashboardSummary(
  profiles: AITrustProfile[],
): AITrustDashboardSummary {
  const profilesByLevel: Record<AITrustLevel, number> = {
    very_low: 0,
    low: 0,
    medium: 0,
    high: 0,
    very_high: 0,
  };

  let totalScore = 0;
  const lowTrustProfiles: string[] = [];

  for (const profile of profiles) {
    profilesByLevel[profile.trustScore.level] += 1;
    totalScore += profile.trustScore.score;

    if (profile.trustScore.score < 50) {
      lowTrustProfiles.push(profile.id);
    }
  }

  const averageTrustScore =
    profiles.length === 0 ? 0 : Math.round((totalScore / profiles.length) * 100) / 100;

  return {
    totalProfiles: profiles.length,
    averageTrustScore,
    profilesByLevel,
    lowTrustProfiles,
    generatedAt: new Date(),
  };
}