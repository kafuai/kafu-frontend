export interface ActionAssignment {
    readonly actionId: string;
    readonly assigneeId: string;

    assignedAt: Date;
    assignedBy?: string;

    primary: boolean;

    notes?: string;
}