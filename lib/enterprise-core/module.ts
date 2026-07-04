import { CoreServiceStatus } from "./types";

export type EnterpriseModule = {
  name: string;
  version: string;
  status: CoreServiceStatus;
  initialize: () => void;
  shutdown?: () => void;
};