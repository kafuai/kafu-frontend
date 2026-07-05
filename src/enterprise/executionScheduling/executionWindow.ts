export interface ExecutionWindow {
  readonly id: string;
  readonly name: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly timezone: string;
  readonly maxConcurrentExecutions: number;
}

export function isWithinExecutionWindow(
  timestamp: string,
  window: ExecutionWindow,
): boolean {
  const time = new Date(timestamp).getTime();
  const start = new Date(window.startsAt).getTime();
  const end = new Date(window.endsAt).getTime();

  return time >= start && time <= end;
}