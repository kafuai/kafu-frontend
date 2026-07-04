import { PlatformSecrets } from "./platformSecrets";

export type PlatformSecretRotationResult = {
  key: string;
  rotated: boolean;
  rotatedAt: Date;
};

export class PlatformSecretRotation {
  constructor(private readonly secrets: PlatformSecrets) {}

  rotate(
    key: string,
    nextValue: string,
  ): PlatformSecretRotationResult {
    this.secrets.set(key, nextValue);

    return {
      key,
      rotated: true,
      rotatedAt: new Date(),
    };
  }
}