import { Action } from './Action';

export class ActionScheduler {
    schedule(action: Action, dueAt: Date): Action {
        action.dueAt = dueAt;
        action.updatedAt = new Date();

        return action;
    }

    isOverdue(action: Action, now: Date = new Date()): boolean {
        return !!action.dueAt && action.dueAt.getTime() < now.getTime();
    }
}