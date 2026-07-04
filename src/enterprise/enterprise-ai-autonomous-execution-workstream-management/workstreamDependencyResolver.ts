import { ExecutionWorkstream, WorkstreamDependency } from './workstream';

export interface WorkstreamDependencyResolution {
  workstreamId: string;
  blockedBy: string[];
  blockingDependencies: WorkstreamDependency[];
  isBlocked: boolean;
  resolutionActions: string[];
}

export class WorkstreamDependencyResolver {
  resolve(
    workstream: ExecutionWorkstream,
    allWorkstreams: ExecutionWorkstream[]
  ): WorkstreamDependencyResolution {
    const blockingDependencies = workstream.dependencies.filter(
      dependency => dependency.blocking
    );

    const blockedBy = blockingDependencies
      .map(dependency => dependency.dependsOnWorkstreamId)
      .filter(dependencyId =>
        allWorkstreams.some(
          candidate =>
            candidate.id === dependencyId && candidate.status !== 'completed'
        )
      );

    return {
      workstreamId: workstream.id,
      blockedBy,
      blockingDependencies,
      isBlocked: blockedBy.length > 0,
      resolutionActions: blockedBy.map(
        id => `Resolve upstream workstream dependency: ${id}`
      )
    };
  }
}