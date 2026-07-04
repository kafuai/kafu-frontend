import { CoreServiceStatus } from "./types";

export type EnterprisePlugin = {
  name: string;
  version: string;
  status: CoreServiceStatus;
  install: () => void;
  uninstall?: () => void;
};