export type RuntimeStatus =
  | "idle"
  | "starting"
  | "running"
  | "failed"
  | "stopped";

export type RuntimeService = {
  name: string;
  version?: string;
  description?: string;
};

export type RuntimeStartupResult = {
  status: RuntimeStatus;
  startedAt: string;
  services: RuntimeService[];
  errors: string[];
};

export type RuntimeLifecycleHook = {
  name: string;
  onStart?: () => void;
  onStop?: () => void;
};