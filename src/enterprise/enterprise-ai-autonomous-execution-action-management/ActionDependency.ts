export interface ActionDependency {
    readonly actionId: string;
    readonly dependsOnActionId: string;

    required: boolean;

    createdAt: Date;

    reason?: string;
}