import { PlatformFeatureFlags } from "./platformFeatureFlags";

export class PlatformFeatureFlagEvaluator {
  constructor(private readonly flags: PlatformFeatureFlags) {}

  evaluate(flagKey: string): boolean {
    return this.flags.enabled(flagKey);
  }

  evaluateMany(flagKeys: string[]): Record<string, boolean> {
    return Object.fromEntries(
      flagKeys.map((flagKey) => [flagKey, this.evaluate(flagKey)]),
    );
  }
}