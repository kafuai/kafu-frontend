export type FoundationModule = {
  id: string;
  name: string;
  enabled: boolean;
};

class ModuleRegistry {
  private modules = new Map<string, FoundationModule>();

  register(module: FoundationModule) {
    this.modules.set(module.id, module);
  }

  get(id: string) {
    return this.modules.get(id);
  }

  getAll() {
    return Array.from(this.modules.values());
  }

  isEnabled(id: string) {
    return this.modules.get(id)?.enabled ?? false;
  }
}

export const moduleRegistry = new ModuleRegistry();