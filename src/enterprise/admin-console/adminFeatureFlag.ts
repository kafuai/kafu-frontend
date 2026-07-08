export interface AdminFeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
}

export function isFeatureEnabled(flag: AdminFeatureFlag): boolean {
  return flag.enabled;
}
