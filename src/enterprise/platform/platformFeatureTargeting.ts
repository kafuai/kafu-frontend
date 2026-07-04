import { PlatformFeatureFlags } from "./platformFeatureFlags";

export type PlatformFeatureTarget = {
  feature: string;
  organizations?: string[];
  environments?: string[];
};

export class PlatformFeatureTargeting {
  constructor(
    private readonly flags: PlatformFeatureFlags,
  ) {}

  enabled(
    target: PlatformFeatureTarget,
    organizationId: string,
    environment: string,
  ): boolean {
    if (!this.flags.enabled(target.feature)) {
      return false;
    }

    if (
      target.organizations &&
      !target.organizations.includes(organizationId)
    ) {
      return false;
    }

    if (
      target.environments &&
      !target.environments.includes(environment)
    ) {
      return false;
    }

    return true;
  }
}