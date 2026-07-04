import { AITrustProfile } from "./aiTrustProfile";
import { AITrustSignal } from "./aiTrustSignal";
import { calculateAITrustScore } from "./aiTrustScore";

export interface AITrustEvaluationResult {
  profileId: string;
  score: number;
  level: AITrustProfile["trustScore"]["level"];
  passed: boolean;
  failedSignals: AITrustSignal[];
  evaluatedAt: Date;
}

export function evaluateAITrustProfile(
  profile: AITrustProfile,
  minimumScore = 70,
): AITrustEvaluationResult {
  const trustScore = calculateAITrustScore(profile.signals);
  const failedSignals = profile.signals.filter(
    (signal) => signal.status === "failed" || signal.score < 50,
  );

  return {
    profileId: profile.id,
    score: trustScore.score,
    level: trustScore.level,
    passed: trustScore.score >= minimumScore && failedSignals.length === 0,
    failedSignals,
    evaluatedAt: new Date(),
  };
}