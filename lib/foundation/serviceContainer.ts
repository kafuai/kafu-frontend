type ServiceMap = Map<string, unknown>;

class ServiceContainer {
  private services: ServiceMap = new Map();

  register<T>(key: string, service: T) {
    if (this.services.has(key)) {
      throw new Error(`Service "${key}" is already registered.`);
    }

    this.services.set(key, service);
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(`Service "${key}" is not registered.`);
    }

    return service as T;
  }

  has(key: string) {
    return this.services.has(key);
  }
}

export const serviceContainer = new ServiceContainer();