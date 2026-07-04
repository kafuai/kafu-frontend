import { MonitoringMetric } from "./monitoringTypes";

export type ResourceSnapshot = {
  targetId: string;
  diskUsage: number;
  networkInBytes: number;
  networkOutBytes: number;
  openConnections: number;
  collectedAt: Date;
};

export function createResourceMetrics(
  snapshot: ResourceSnapshot,
): MonitoringMetric[] {
  return [
    {
      id: `${snapshot.targetId}-disk`,
      targetId: snapshot.targetId,
      name: "disk.usage",
      value: snapshot.diskUsage,
      unit: "%",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-network-in`,
      targetId: snapshot.targetId,
      name: "network.in",
      value: snapshot.networkInBytes,
      unit: "bytes",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-network-out`,
      targetId: snapshot.targetId,
      name: "network.out",
      value: snapshot.networkOutBytes,
      unit: "bytes",
      recordedAt: snapshot.collectedAt,
    },
    {
      id: `${snapshot.targetId}-connections`,
      targetId: snapshot.targetId,
      name: "connections.open",
      value: snapshot.openConnections,
      unit: "count",
      recordedAt: snapshot.collectedAt,
    },
  ];
}