import { Action } from './Action';
import { ActionStatus } from './ActionStatus';

export class ActionMetrics {
    count(actions: readonly Action[]): number {
        return actions.length;
    }

    completed(actions: readonly Action[]): number {
        return actions.filter(
            action => action.status === ActionStatus.COMPLETED
        ).length;
    }

    completionRate(actions: readonly Action[]): number {
        if (actions.length === 0) {
            return 0;
        }

        return this.completed(actions) / actions.length;
    }
}