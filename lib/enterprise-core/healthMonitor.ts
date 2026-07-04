import { getCoreServices } from "./coreRegistry";
import { getEnterpriseModules } from "./moduleRegistry";
import { getEnterprisePlugins } from "./pluginRegistry";

export function getEnterpriseHealth() {
  const services = getCoreServices();
  const modules = getEnterpriseModules();
  const plugins = getEnterprisePlugins();

  const readyServices = services.filter(
    (service) => service.status === "ready"
  ).length;

  const readyModules = modules.filter(
    (module) => module.status === "ready"
  ).length;

  const readyPlugins = plugins.filter(
    (plugin) => plugin.status === "ready"
  ).length;

  return {
    status: "healthy",
    services: {
      total: services.length,
      ready: readyServices,
    },
    modules: {
      total: modules.length,
      ready: readyModules,
    },
    plugins: {
      total: plugins.length,
      ready: readyPlugins,
    },
    timestamp: new Date().toISOString(),
  };
}