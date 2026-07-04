import { EnterpriseRuntime } from "./EnterpriseRuntime";
import { RuntimeBootstrap } from "./runtimeBootstrap";
import { PluginRegistry } from "./pluginRegistry";
import { IntelligenceRuntime } from "./intelligenceRuntime";

export class RuntimeOrchestrator {
  private runtime: EnterpriseRuntime;
  private bootstrap: RuntimeBootstrap;
  private plugins: PluginRegistry;
  private intelligenceRuntime?: IntelligenceRuntime;

  constructor() {
    this.runtime = new EnterpriseRuntime();
    this.bootstrap = new RuntimeBootstrap(this.runtime);
    this.plugins = new PluginRegistry();
  }

  startSystem() {
    // 1. Bootstrap services
    const result = this.bootstrap.start();

    // 2. Load plugins (future integration point)
    const installedPlugins = this.plugins.list();

    // 3. Activate plugins automatically
    for (const p of installedPlugins) {
      this.plugins.activate(p.plugin.name);
    }

    return {
      runtime: result,
      plugins: installedPlugins,
    };
  }

  stopSystem() {
    for (const p of this.plugins.list()) {
      this.plugins.deactivate(p.plugin.name);
    }

    return this.bootstrap.stop();
  }

  getRuntime() {
    return this.runtime;
  }

  getPlugins() {
    return this.plugins.list();
  }

  getIntelligenceRuntime() {
    return this.intelligenceRuntime;
  }
}