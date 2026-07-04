import { EnterprisePlugin } from "./plugin";

const enterprisePlugins: EnterprisePlugin[] = [];

export function registerEnterprisePlugin(plugin: EnterprisePlugin) {
  const existingPlugin = enterprisePlugins.find(
    (item) => item.name === plugin.name
  );

  if (existingPlugin) {
    return;
  }

  enterprisePlugins.push(plugin);
}

export function getEnterprisePlugins() {
  return enterprisePlugins;
}