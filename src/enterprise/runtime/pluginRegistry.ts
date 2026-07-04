import { RuntimePlugin, PluginStatus } from "./pluginTypes";

type PluginRecord = {
  plugin: RuntimePlugin;
  status: PluginStatus;
};

export class PluginRegistry {
  private readonly plugins = new Map<string, PluginRecord>();

  install(plugin: RuntimePlugin): void {
    this.plugins.set(plugin.name, {
      plugin,
      status: "installed",
    });

    plugin.onLoad?.();
  }

 activate(name: string): void {
    const record = this.plugins.get(name);

    if (!record) return;

    record.status = "active";
    record.plugin.onStart?.();
  }

  deactivate(name: string): void {
    const record = this.plugins.get(name);

    if (!record) return;

    record.status = "inactive";
    record.plugin.onStop?.();
  }

  list(): PluginRecord[] {
    return Array.from(this.plugins.values());
  }
}