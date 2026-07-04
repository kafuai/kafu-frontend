import { MonitoringMetric } from "./monitoringTypes";

export type PerformanceSnapshot = {
  targetId: string;
  cpuUsage: number;
  memoryUsage: number;
  averageResponseTimeMs: number;
  throughputPerSecond: number;
  collectedAt: Date;
};

export function createPerformanceMetrics(
  snapshot: PerformanceSnapshot,
): MonitoringMetric[] {
  return [
    {
      id: `${snapshot.targetId}-cpu`,
      targetId: snapshot.targetId,
      name: "cpu.usage",
      value: snapshot.cpuUsage,
      unit: "%",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-memory`,
      targetId: snapshot.targetId,
      name: "memory.usage",
      value: snapshot.memoryUsage,
      unit: "%",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-latency`,
      targetId: snapshot.targetId,
      name: "response.time",
      value: snapshot.averageResponseTimeMs,
      unit: "ms",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-throughput`,
      targetId: snapshot.targetId,
      name: "throughput",
      value: snapshot.throughputPerSecond,
      unit: "req/s",
      recordedAt: snapshot.collectedAt,
    },
  ];
}