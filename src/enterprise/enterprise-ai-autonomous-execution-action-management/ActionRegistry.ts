import { Action } from './Action';

export class ActionRegistry {
    private readonly registry = new Map<string, Action>();

    add(action: Action): void {
        this.registry.set(action.id, action);
    }

    get(id: string): Action | undefined {
        return this.registry.get(id);
    }

    has(id: string): boolean {
        return this.registry.has(id);
    }

    values(): readonly Action[] {
        return [...this.registry.values()];
    }

    clear(): void {
        this.registry.clear();
    }
}