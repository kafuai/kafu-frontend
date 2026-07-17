export type PostLaunchHealthLevel =
  | "healthy"
  | "watch"
  | "degraded"
  | "critical";

export interface PostLaunchHealth {
  level: PostLaunchHealthLevel;
  customerAdoptionScore: number;
  serviceHealthScore: number;
  openIssueCount: number;
  criticalIssueCount: number;
  lastReviewedAt?: string;
}

export function isPostLaunchHealthy(
  health: PostLaunchHealth,
): boolean {
  return (
    health.level === "healthy" &&
    health.serviceHealthScore >= 80 &&
    health.criticalIssueCount === 0
  );
}
