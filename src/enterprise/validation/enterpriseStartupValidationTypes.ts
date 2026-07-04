export type EnterpriseStartupValidationContext = {
  runtimeStatus: string;
  providerCount: number;
  registeredEventCount: number;
  registeredHealthCheckCount: number;
  pluginCount: number;
};

export type EnterpriseStartupValidationResult = {
  valid: boolean;
  errors: string[];
  checkedAt: string;
};