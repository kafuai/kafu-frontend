export interface ActionExecutionResult {
    readonly actionId: string;

    success: boolean;

    executedAt: Date;

    durationMs: number;

    output?: unknown;

    error?: string;
}