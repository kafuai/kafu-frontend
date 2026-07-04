import {
  ExecutionWorkstream,
  WorkstreamCreateInput,
  WorkstreamUpdateInput
} from './workstream';

export class WorkstreamManager {
  private readonly workstreams = new Map<string, ExecutionWorkstream>();

  create(input: WorkstreamCreateInput): ExecutionWorkstream {
    const now = new Date().toISOString();

    const workstream: ExecutionWorkstream = {
      id: crypto.randomUUID(),
      initiativeId: input.initiativeId,
      name: input.name,
      description: input.description,
      owner: input.owner,
      status: 'planned',
      priority: input.priority,
      health: 'healthy',
      progressPercent: 0,
      startDate: input.startDate,
      targetDate: input.targetDate,
      dependencies: [],
      risks: [],
      milestones: [],
      createdAt: now,
      updatedAt: now
    };

    this.workstreams.set(workstream.id, workstream);

    return workstream;
  }

  get(id: string): ExecutionWorkstream | undefined {
    return this.workstreams.get(id);
  }

  list(): ExecutionWorkstream[] {
    return [...this.workstreams.values()];
  }

  update(
    id: string,
    updates: WorkstreamUpdateInput
  ): ExecutionWorkstream | undefined {
    const existing = this.workstreams.get(id);

    if (!existing) {
      return undefined;
    }

    const updated: ExecutionWorkstream = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.workstreams.set(id, updated);

    return updated;
  }

  delete(id: string): boolean {
    return this.workstreams.delete(id);
  }
}