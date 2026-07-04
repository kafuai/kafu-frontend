import { ExecutionWorkstream } from './workstream';

export interface WorkstreamProgressSnapshot {
  workstreamId: string;
  milestoneCompletionPercent: number;
  overallProgressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  lastUpdated: string;
}

export class WorkstreamProgressTracker {
  createSnapshot(
    workstream: ExecutionWorkstream
  ): WorkstreamProgressSnapshot {
    const totalMilestones = workstream.milestones.length;

    const completedMilestones = workstream.milestones.filter(
      milestone => milestone.completed
    ).length;

    const milestoneCompletionPercent =
      totalMilestones === 0
        ? 0
        : Math.round((completedMilestones / totalMilestones) * 100);

    return {
      workstreamId: workstream.id,
      milestoneCompletionPercent,
      overallProgressPercent: workstream.progressPercent,
      completedMilestones,
      totalMilestones,
      lastUpdated: new Date().toISOString()
    };
  }

  synchronize(
    workstream: ExecutionWorkstream
  ): ExecutionWorkstream {
    const snapshot = this.createSnapshot(workstream);

    return {
      ...workstream,
      progressPercent: Math.max(
        workstream.progressPercent,
        snapshot.milestoneCompletionPercent
      ),
      updatedAt: snapshot.lastUpdated
    };
  }
}