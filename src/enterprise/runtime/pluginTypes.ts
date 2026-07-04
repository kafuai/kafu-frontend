export type PluginStatus =
  | "installed"
  | "active"
  | "inactive"
  | "failed";

export type RuntimePlugin = {
  name: string;
  version: string;
  description?: string;

  onLoad?: () => void;
  onStart?: () => void;
  onStop?: () => void;
};