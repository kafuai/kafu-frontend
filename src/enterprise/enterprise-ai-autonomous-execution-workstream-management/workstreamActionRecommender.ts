import { ExecutionWorkstream } from './workstream';
import { WorkstreamDependencyResolver } from './workstreamDependencyResolver';
import { WorkstreamHealthEvaluator } from './workstreamHealthEvaluator';

export interface WorkstreamActionRecommendation {
  workstreamId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  rationale: string;
}

export class WorkstreamActionRecommender {
  private readonly healthEvaluator = new WorkstreamHealthEvaluator();
  private readonly dependencyResolver = new WorkstreamDependencyResolver();

  recommend(
    workstream: ExecutionWorkstream,
    allWorkstreams: ExecutionWorkstream[]
  ): WorkstreamActionRecommendation[] {
    const recommendations: WorkstreamActionRecommendation[] = [];
    const health = this.healthEvaluator.evaluate(workstream);
    const dependencyResolution = this.dependencyResolver.resolve(
      workstream,
      allWorkstreams
    );

    if (dependencyResolution.isBlocked) {
      recommendations.push({
        workstreamId: workstream.id,
        priority: 'critical',
        action: 'Unblock dependency chain',
        rationale: dependencyResolution.resolutionActions.join('; ')
      });
    }

    if (health === 'critical') {
      recommendations.push({
        workstreamId: workstream.id,
        priority: 'critical',
        action: 'Escalate workstream immediately',
        rationale: 'Workstream health is critical and requires executive attention.'
      });
    }

    if (health === 'risk') {
      recommendations.push({
        workstreamId: workstream.id,
        priority: 'high',
        action: 'Activate mitigation plan',
        rationale: 'Workstream risk level is elevated.'
      });
    }

    if (workstream.progressPercent >= 90 && workstream.status !== 'completed') {
      recommendations.push({
        workstreamId: workstream.id,
        priority: 'medium',
        action: 'Prepare completion review',
        rationale: 'Workstream is near completion and should be validated.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        workstreamId: workstream.id,
        priority: 'low',
        action: 'Continue execution monitoring',
        rationale: 'No immediate intervention required.'
      });
    }

    return recommendations;
  }
}