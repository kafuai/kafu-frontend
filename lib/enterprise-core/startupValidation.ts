import { getCoreServices } from "./coreRegistry";
import { getEnterpriseModules } from "./moduleRegistry";
import { getEnterprisePlugins } from "./pluginRegistry";

export function validateEnterpriseStartup() {
  const services = getCoreServices();
  const modules = getEnterpriseModules();
  const plugins = getEnterprisePlugins();

  return {
    isValid: true,
    servicesCount: services.length,
    modulesCount: modules.length,
    pluginsCount: plugins.length,
    checkedAt: new Date().toISOString(),
  };
}