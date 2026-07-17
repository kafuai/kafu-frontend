import type { ExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentTypes";
import { buildExecutiveDemoEnvironmentContext } from "./executiveDemoEnvironmentContext";
import { buildExecutiveDemoEnvironmentHealthReport } from "./executiveDemoEnvironmentHealth";
import { assessExecutiveDemoEnvironmentReadiness } from "./executiveDemoEnvironmentReadiness";
import { resolveExecutiveDemoAudienceProfile } from "./executiveDemoAudienceProfile";
import { createExecutiveDemoEnvironmentSnapshot } from "./executiveDemoEnvironmentSnapshot";
import { validateExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentValidator";

export interface ExecutiveDemoEnvironmentBundle {
  configuration: ExecutiveDemoEnvironmentConfiguration;
  context: ReturnType<typeof buildExecutiveDemoEnvironmentContext>;
  audienceProfile: ReturnType<typeof resolveExecutiveDemoAudienceProfile>;
  validation: ReturnType<
    typeof validateExecutiveDemoEnvironmentConfiguration
  >;
  health: ReturnType<typeof buildExecutiveDemoEnvironmentHealthReport>;
  readiness: ReturnType<typeof assessExecutiveDemoEnvironmentReadiness>;
  snapshot: ReturnType<typeof createExecutiveDemoEnvironmentSnapshot>;
}

export function buildExecutiveDemoEnvironmentBundle(
  configuration: ExecutiveDemoEnvironmentConfiguration,
  locale?: string,
): ExecutiveDemoEnvironmentBundle {
  return {
    configuration,
    context: buildExecutiveDemoEnvironmentContext(
      configuration,
      locale,
    ),
    audienceProfile:
      resolveExecutiveDemoAudienceProfile(configuration),
    validation:
      validateExecutiveDemoEnvironmentConfiguration(configuration),
    health:
      buildExecutiveDemoEnvironmentHealthReport(configuration),
    readiness:
      assessExecutiveDemoEnvironmentReadiness(configuration),
    snapshot:
      createExecutiveDemoEnvironmentSnapshot(configuration),
  };
}
