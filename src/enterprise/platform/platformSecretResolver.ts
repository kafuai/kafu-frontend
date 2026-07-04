import { PlatformSecrets } from "./platformSecrets";

export class PlatformSecretResolver {
  constructor(private readonly secrets: PlatformSecrets) {}

  require(key: string): string {
    const value = this.secrets.get(key);

    if (!value) {
      throw new Error(`Missing platform secret: ${key}`);
    }

    return value;
  }

  optional(key: string): string | undefined {
    return this.secrets.get(key);
  }
}