import type { ExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentTypes";
import { applyExecutiveDemoEnvironmentOverride } from "./executiveDemoEnvironmentOverride";
import type { ExecutiveDemoEnvironmentOverride } from "./executiveDemoEnvironmentOverride";
import { buildExecutiveDemoEnvironmentBundle } from "./executiveDemoEnvironmentBundle";
import { createExecutiveDemoEnvironmentConfiguration } from "./executiveDemoEnvironmentConfiguration";

export interface ExecutiveDemoEnvironmentFactoryInput {
  configuration?: ExecutiveDemoEnvironmentConfiguration;
  override?: ExecutiveDemoEnvironmentOverride;
  locale?: string;
}

export function createExecutiveDemoEnvironment(
  input: ExecutiveDemoEnvironmentFactoryInput = {},
) {
  const baseConfiguration =
    input.configuration ??
    createExecutiveDemoEnvironmentConfiguration();

  const resolvedConfiguration = input.override
    ? applyExecutiveDemoEnvironmentOverride(
        baseConfiguration,
        input.override,
      )
    : baseConfiguration;

  return buildExecutiveDemoEnvironmentBundle(
    resolvedConfiguration,
    input.locale,
  );
}
