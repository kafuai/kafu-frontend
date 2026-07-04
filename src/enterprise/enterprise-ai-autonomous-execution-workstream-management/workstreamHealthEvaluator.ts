import { ExecutionWorkstream, WorkstreamHealth } from './workstream';

export class WorkstreamHealthEvaluator {
  evaluate(workstream: ExecutionWorkstream): WorkstreamHealth {
    if (workstream.status === 'blocked') {
      return 'critical';
    }

    const criticalRisks = workstream.risks.filter(
      risk => risk.severity === 'critical'
    ).length;

    if (criticalRisks > 0) {
      return 'critical';
    }

    const highRisks = workstream.risks.filter(
      risk => risk.severity === 'high'
    ).length;

    if (highRisks >= 2) {
      return 'risk';
    }

    if (workstream.progressPercent < 50 && highRisks > 0) {
      return 'watch';
    }

    if (workstream.status === 'at_risk') {
      return 'risk';
    }

    return 'healthy';
  }

  update(workstream: ExecutionWorkstream): ExecutionWorkstream {
    return {
      ...workstream,
      health: this.evaluate(workstream),
      updatedAt: new Date().toISOString()
    };
  }
}