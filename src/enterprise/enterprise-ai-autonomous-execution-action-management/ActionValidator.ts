import { Action } from './Action';

export class ActionValidator {
    validate(action: Action): string[] {
        const errors: string[] = [];

        if (!action.id.trim()) {
            errors.push('Action id is required.');
        }

        if (!action.activityId.trim()) {
            errors.push('Activity id is required.');
        }

        if (!action.title.trim()) {
            errors.push('Action title is required.');
        }

        return errors;
    }

    isValid(action: Action): boolean {
        return this.validate(action).length === 0;
    }
}