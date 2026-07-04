export type EnterpriseServiceStatus = "idle" | "ready" | "error";

export type EnterpriseServiceDefinition = {
  name: string;
  version?: string;
  description?: string;
  status: EnterpriseServiceStatus;
};

export type EnterpriseServiceContract = {
  name: string;
  initialize?: () => Promise<void> | void;
  healthCheck?: () => Promise<boolean> | boolean;
};