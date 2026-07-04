export type PlatformSecretRecord = {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};

export class PlatformSecrets {
  private readonly secrets = new Map<string, PlatformSecretRecord>();

  set(key: string, value: string): void {
    const existing = this.secrets.get(key);
    const now = new Date();

    this.secrets.set(key, {
      key,
      value,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }

  get(key: string): string | undefined {
    return this.secrets.get(key)?.value;
  }

  has(key: string): boolean {
    return this.secrets.has(key);
  }

  remove(key: string): boolean {
    return this.secrets.delete(key);
  }

  listKeys(): string[] {
    return [...this.secrets.keys()];
  }
}