import {
  EnterprisePlugin,
  EnterprisePluginStatus,
} from "./enterprisePluginTypes";

export class EnterprisePluginRegistry {
  private readonly plugins = new Map<string, EnterprisePlugin>();

  register(plugin: EnterprisePlugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  initializeAll(): EnterprisePluginStatus[] {
    const statuses: EnterprisePluginStatus[] = [];

    for (const plugin of this.plugins.values()) {
      plugin.initialize();

      statuses.push({
        name: plugin.name,
        initialized: true,
      });
    }

    return statuses;
  }

  getPlugins(): EnterprisePlugin[] {
    return Array.from(this.plugins.values());
  }
}