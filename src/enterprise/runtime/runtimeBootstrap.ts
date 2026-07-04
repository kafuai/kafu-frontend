import { EnterpriseRuntime } from "./EnterpriseRuntime";
import { ServiceDiscovery } from "./serviceDiscovery";

export class RuntimeBootstrap {
  private runtime: EnterpriseRuntime;
  private discovery: ServiceDiscovery;

  constructor(runtime: EnterpriseRuntime) {
    this.runtime = runtime;
    this.discovery = new ServiceDiscovery();
  }

  initialize(): void {
    const services = this.discovery.discover();

    for (const service of services) {
      this.runtime.registerService(
        service.name,
        service.version,
        service.description
      );
    }
  }

  start() {
    this.initialize();
    return this.runtime.startup();
  }

  stop() {
    return this.runtime.shutdown();
  }
}