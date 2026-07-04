export type EnterprisePlugin = {
  name: string;
  version: string;
  initialize: () => void;
};

export type EnterprisePluginStatus = {
  name: string;
  initialized: boolean;
};