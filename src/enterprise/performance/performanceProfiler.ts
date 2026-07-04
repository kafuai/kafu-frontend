import {
  PerformanceMetric,
  PerformanceProfile,
} from "./performanceTypes";

export type PerformanceProfileSnapshot = {
  profileId: string;
  metricCount: number;
  averageValue: number;
  capturedAt: Date;
};

export function createPerformanceProfileSnapshot(
  profile: PerformanceProfile,
): PerformanceProfileSnapshot {
  const averageValue =
    profile.metrics.length === 0
      ? 0
      : profile.metrics.reduce((sum, metric) => sum + metric.value, 0) /
        profile.metrics.length;

  return {
    profileId: profile.id,
    metricCount: profile.metrics.length,
    averageValue,
    capturedAt: new Date(),
  };
}

export function appendMetricToProfile(
  profile: PerformanceProfile,
  metric: PerformanceMetric,
): PerformanceProfile {
  return {
    ...profile,
    metrics: [...profile.metrics, metric],
    updatedAt: new Date(),
  };
}