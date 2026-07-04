import { EnterpriseServiceContract } from "./enterpriseServiceTypes";

export type EnterpriseConfiguration = {
  appName: string;
  environment: "development" | "staging" | "production";
  version: string;
};

export class ConfigurationService implements EnterpriseServiceContract {
  readonly name = "configuration-service";

  private readonly config: EnterpriseConfiguration = {
    appName: "KAFU AI",
    environment: "development",
    version: "1.0.0",
  };

  getConfig(): EnterpriseConfiguration {
    return this.config;
  }

  getValue<K extends keyof EnterpriseConfiguration>(
    key: K,
  ): EnterpriseConfiguration[K] {
    return this.config[key];
  }

  healthCheck(): boolean {
    return true;
  }
}