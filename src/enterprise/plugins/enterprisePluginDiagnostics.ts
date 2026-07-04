import { EnterprisePluginRegistry } from "./enterprisePluginRegistry";

export function getEnterprisePluginDiagnostics(
  pluginRegistry: EnterprisePluginRegistry,
) {
  const plugins = pluginRegistry.getPlugins();

  return {
    pluginCount: plugins.length,
    plugins: plugins.map((plugin) => ({
      name: plugin.name,
      version: plugin.version,
    })),
  };
}