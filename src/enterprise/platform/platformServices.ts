import { PlatformBackgroundJobs } from "./platformBackgroundJobs";
import { PlatformCache } from "./platformCache";
import { PlatformConfiguration } from "./platformConfiguration";
import { PlatformConfigurationProvider } from "./platformConfigurationProvider";
import { PlatformFeatureFlagEvaluator } from "./platformFeatureFlagEvaluator";
import { PlatformFeatureFlags } from "./platformFeatureFlags";
import { PlatformJobRunner } from "./platformJobRunner";
import { PlatformScheduler } from "./platformScheduler";
import { PlatformSecrets } from "./platformSecrets";
import { PlatformSecretResolver } from "./platformSecretResolver";
import { PlatformServiceRegistry } from "./platformServiceRegistry";
import { PlatformStorage } from "./platformStorage";

export class PlatformServices {
  readonly configuration = new PlatformConfiguration();
  readonly configurationProvider = new PlatformConfigurationProvider(
    this.configuration,
  );

  readonly featureFlags = new PlatformFeatureFlags();
  readonly featureFlagEvaluator = new PlatformFeatureFlagEvaluator(
    this.featureFlags,
  );

  readonly secrets = new PlatformSecrets();
  readonly secretResolver = new PlatformSecretResolver(this.secrets);

  readonly scheduler = new PlatformScheduler();

  readonly backgroundJobs = new PlatformBackgroundJobs();
  readonly jobRunner = new PlatformJobRunner(this.backgroundJobs);

  readonly cache = new PlatformCache();
  readonly storage = new PlatformStorage();

  readonly registry = new PlatformServiceRegistry();

  initialize(): void {
    this.registry.register({
      capability: "configuration",
      name: "PlatformConfiguration",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "feature-flags",
      name: "PlatformFeatureFlags",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "secrets",
      name: "PlatformSecrets",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "scheduling",
      name: "PlatformScheduler",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "background-jobs",
      name: "PlatformBackgroundJobs",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "cache",
      name: "PlatformCache",
      version: "1.0.0",
      status: "active",
    });

    this.registry.register({
      capability: "storage",
      name: "PlatformStorage",
      version: "1.0.0",
      status: "active",
    });
  }
}