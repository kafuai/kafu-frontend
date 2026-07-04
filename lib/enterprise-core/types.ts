export type CoreServiceStatus = "idle" | "ready" | "error";

export type CoreService = {
  name: string;
  version: string;
  status: CoreServiceStatus;
};