import { Action } from './Action';
import { ActionStatus } from './ActionStatus';

export class ActionManager {
    private readonly actions = new Map<string, Action>();

    register(action: Action): void {
        this.actions.set(action.id, action);
    }

    get(actionId: string): Action | undefined {
        return this.actions.get(actionId);
    }

    getAll(): readonly Action[] {
        return [...this.actions.values()];
    }

    updateStatus(actionId: string, status: ActionStatus): boolean {
        const action = this.actions.get(actionId);

        if (!action) {
            return false;
        }

        action.status = status;
        action.updatedAt = new Date();

        return true;
    }

    remove(actionId: string): boolean {
        return this.actions.delete(actionId);
    }
}