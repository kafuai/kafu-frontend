export type PlatformFeatureFlag = {
  key: string;
  enabled: boolean;
  description?: string;
};

export class PlatformFeatureFlags {
  private readonly flags = new Map<string, PlatformFeatureFlag>();

  register(flag: PlatformFeatureFlag): void {
    this.flags.set(flag.key, flag);
  }

  enabled(key: string): boolean {
    return this.flags.get(key)?.enabled ?? false;
  }

  enable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = true;
    }
  }

  disable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = false;
    }
  }

  list(): PlatformFeatureFlag[] {
    return [...this.flags.values()];
  }
}