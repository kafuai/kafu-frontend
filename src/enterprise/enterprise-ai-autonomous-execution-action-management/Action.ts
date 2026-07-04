import { ActionPriority } from './ActionPriority';
import { ActionStatus } from './ActionStatus';

export interface Action {
    readonly id: string;
    readonly activityId: string;

    title: string;
    description?: string;

    priority: ActionPriority;
    status: ActionStatus;

    ownerId?: string;

    dependencies: string[];

    createdAt: Date;
    updatedAt: Date;
    dueAt?: Date;

    metadata: Record<string, unknown>;
}