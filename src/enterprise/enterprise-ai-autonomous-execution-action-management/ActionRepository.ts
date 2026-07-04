import { Action } from './Action';
import { ActionFilter } from './ActionFilter';

export class ActionRepository {
    private readonly actions = new Map<string, Action>();

    save(action: Action): void {
        this.actions.set(action.id, action);
    }

    findById(id: string): Action | undefined {
        return this.actions.get(id);
    }

    findAll(filter: ActionFilter = {}): readonly Action[] {
        return [...this.actions.values()].filter(action => {
            if (filter.status && action.status !== filter.status) return false;
            if (filter.priority && action.priority !== filter.priority) return false;
            if (filter.ownerId && action.ownerId !== filter.ownerId) return false;
            if (filter.activityId && action.activityId !== filter.activityId) return false;

            return true;
        });
    }

    delete(id: string): boolean {
        return this.actions.delete(id);
    }
}