import { EnterpriseServiceContract } from "./enterpriseServiceTypes";

export type EnterpriseEnvironment = {
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
};

export class EnvironmentService implements EnterpriseServiceContract {
  readonly name = "environment-service";

  getEnvironment(): EnterpriseEnvironment {
    const nodeEnv = process.env.NODE_ENV ?? "development";

    return {
      nodeEnv,
      isDevelopment: nodeEnv === "development",
      isProduction: nodeEnv === "production",
    };
  }

  healthCheck(): boolean {
    return true;
  }
}