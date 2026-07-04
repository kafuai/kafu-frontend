import { ActionPriority } from './ActionPriority';
import { ActionStatus } from './ActionStatus';

export interface ActionFilter {
    status?: ActionStatus;

    priority?: ActionPriority;

    ownerId?: string;

    activityId?: string;
}