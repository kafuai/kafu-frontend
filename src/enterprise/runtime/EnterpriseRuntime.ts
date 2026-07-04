import {
  RuntimeLifecycleHook,
  RuntimeStartupResult,
  RuntimeStatus,
} from "./enterpriseRuntimeTypes";
import { RuntimeContainer } from "./runtimeContainer";
import { RuntimeLifecycleManager } from "./runtimeLifecycleManager";
import { RuntimeRegistry } from "./runtimeRegistry";
import { EnterpriseServiceContract, EnterpriseServicesManager } from "../services";
import { RuntimeValidator } from "./runtimeValidator";
import { EnterpriseIntelligenceCore } from "../intelligence";
import {
  IntelligenceFlowRuntime,
  IntelligenceFlowRuntimeInput,
} from "./intelligenceFlowRuntime";
import { RUNTIME_REGISTRY_TOKEN } from "./runtimeBuiltInTokens";
import {
  EnterpriseDIContainer,
  EnterpriseDIModule,
  EnterpriseDIProvider,
  EnterpriseDIResolver,
  EnterpriseDIToken,
  EnterpriseDIValidator,
  getEnterpriseDIDiagnostics,
  ENTERPRISE_DI_CONTAINER_TOKEN,
  ENTERPRISE_DI_RESOLVER_TOKEN,
} from "../di";
import {
  EnterpriseEventBus,
  EnterpriseEventHandler,
  EnterpriseEventName,
  EnterpriseEventPayload,
  getEnterpriseEventDiagnostics,
  ENTERPRISE_EVENT_BUS_TOKEN,
} from "../events";
import {
  EnterpriseHealthCheck,
  EnterpriseHealthMonitor,
  getEnterpriseHealthDiagnostics,
  ENTERPRISE_HEALTH_MONITOR_TOKEN,
} from "../health";
import {
  EnterpriseDiagnosticsCollector,
  ENTERPRISE_DIAGNOSTICS_COLLECTOR_TOKEN,
} from "../diagnostics";
import {
  EnterprisePlugin,
  EnterprisePluginRegistry,
  getEnterprisePluginDiagnostics,
  ENTERPRISE_PLUGIN_REGISTRY_TOKEN,
} from "../plugins";
import { EnterpriseStartupValidator } from "../validation";

export class EnterpriseRuntime {
  private status: RuntimeStatus = "idle";
  private readonly registry = new RuntimeRegistry();
  private readonly lifecycle = new RuntimeLifecycleManager();
  private readonly services = new EnterpriseServicesManager();
  private readonly validator = new RuntimeValidator();
  private readonly diValidator = new EnterpriseDIValidator();
  private readonly startupValidator = new EnterpriseStartupValidator();
  private readonly container = new RuntimeContainer();
  private readonly diContainer = new EnterpriseDIContainer();
  private readonly diResolver = new EnterpriseDIResolver(this.diContainer);
  private readonly eventBus = new EnterpriseEventBus();
  private readonly healthMonitor = new EnterpriseHealthMonitor();
  private readonly diagnosticsCollector = new EnterpriseDiagnosticsCollector();
  private readonly pluginRegistry = new EnterprisePluginRegistry();
  private readonly intelligence = new EnterpriseIntelligenceCore();
  private readonly intelligenceFlow = new IntelligenceFlowRuntime();

  constructor() {
    this.container.register(RUNTIME_REGISTRY_TOKEN, this.registry);

    this.diContainer.register({
      token: ENTERPRISE_DI_CONTAINER_TOKEN,
      scope: "singleton",
      useValue: this.diContainer,
    });

    this.diContainer.register({
      token: ENTERPRISE_DI_RESOLVER_TOKEN,
      scope: "singleton",
      useValue: this.diResolver,
    });

    this.diContainer.register({
      token: ENTERPRISE_EVENT_BUS_TOKEN,
      scope: "singleton",
      useValue: this.eventBus,
    });

    this.diContainer.register({
      token: ENTERPRISE_HEALTH_MONITOR_TOKEN,
      scope: "singleton",
      useValue: this.healthMonitor,
    });

    this.diContainer.register({
      token: ENTERPRISE_DIAGNOSTICS_COLLECTOR_TOKEN,
      scope: "singleton",
      useValue: this.diagnosticsCollector,
    });

    this.diContainer.register({
      token: ENTERPRISE_PLUGIN_REGISTRY_TOKEN,
      scope: "singleton",
      useValue: this.pluginRegistry,
    });
  }

  getStatus(): RuntimeStatus {
    return this.status;
  }

  registerProvider<T>(provider: EnterpriseDIProvider<T>): void {
    this.diContainer.register(provider);
  }

  registerDIModule(module: EnterpriseDIModule): void {
    module.register(this.diContainer);
  }

  resolve<T>(token: EnterpriseDIToken<T>): T | undefined {
    return this.diResolver.resolve(token);
  }

  getDIDiagnostics() {
    return getEnterpriseDIDiagnostics(this.diContainer);
  }

  getEventDiagnostics() {
    return getEnterpriseEventDiagnostics(this.eventBus);
  }

  getHealthDiagnostics() {
    return getEnterpriseHealthDiagnostics(this.healthMonitor);
  }

  getPluginDiagnostics() {
    return getEnterprisePluginDiagnostics(this.pluginRegistry);
  }

  generateDiagnosticsReport() {
    this.diagnosticsCollector.addSection({
      name: "dependency-injection",
      status: "available",
      data: this.getDIDiagnostics(),
    });

    this.diagnosticsCollector.addSection({
      name: "event-bus",
      status: "available",
      data: this.getEventDiagnostics(),
    });

    this.diagnosticsCollector.addSection({
      name: "health-monitor",
      status: "available",
      data: this.getHealthDiagnostics(),
    });

    this.diagnosticsCollector.addSection({
      name: "plugins",
      status: "available",
      data: this.getPluginDiagnostics(),
    });

    return this.diagnosticsCollector.generateReport();
  }

  registerPlugin(plugin: EnterprisePlugin): void {
    this.pluginRegistry.register(plugin);
  }

  initializePlugins() {
    return this.pluginRegistry.initializeAll();
  }

  registerHealthCheck(check: EnterpriseHealthCheck): void {
    this.healthMonitor.register(check);
  }

  async runEnterpriseHealthChecks() {
    return this.healthMonitor.runAll();
  }

  onEvent<TPayload extends EnterpriseEventPayload>(
    name: EnterpriseEventName,
    handler: EnterpriseEventHandler<TPayload>,
  ): void {
    this.eventBus.on(name, handler);
  }

  emitEvent<TPayload extends EnterpriseEventPayload>(
    name: EnterpriseEventName,
    payload: TPayload,
  ) {
    return this.eventBus.emit(name, payload);
  }

  getService<T extends EnterpriseServiceContract>(
    name: string,
  ): T | undefined {
    return this.services.getService<T>(name);
  }

  getServicesRegistry() {
    return this.services.getServicesRegistry();
  }

  async runHealthChecks(): Promise<Record<string, boolean>> {
    return this.services.runHealthChecks();
  }

  registerService(name: string, version?: string, description?: string): void {
    this.registry.register({
      name,
      version,
      description,
    });
  }

  registerLifecycleHook(hook: RuntimeLifecycleHook): void {
    this.lifecycle.register(hook);
  }

  runIntelligenceFlow(input: IntelligenceFlowRuntimeInput) {
    return this.intelligenceFlow.run(input);
  }

  startup(): RuntimeStartupResult {
    this.status = "starting";
    this.services.registerServices();
    this.services.initializeServices();
    this.initializePlugins();

    const startupValidation = this.startupValidator.validate({
      runtimeStatus: this.status,
      providerCount: this.getDIDiagnostics().providerCount,
      registeredEventCount: this.getEventDiagnostics().registeredEventCount,
      registeredHealthCheckCount:
        this.getHealthDiagnostics().registeredCheckCount,
      pluginCount: this.getPluginDiagnostics().pluginCount,
    });

    const runtimeErrors = this.validator.validate(this.registry);
    const diErrors = this.diValidator.validate(this.diContainer);
    const errors = [
      ...startupValidation.errors,
      ...runtimeErrors,
      ...diErrors,
    ];

    if (errors.length > 0) {
      this.status = "failed";

      return {
        status: this.status,
        startedAt: new Date().toISOString(),
        services: this.registry.getAll(),
        errors,
      };
    }

    this.lifecycle.startAll();

    this.status = "running";

    return {
      status: this.status,
      startedAt: new Date().toISOString(),
      services: this.registry.getAll(),
      errors: [],
    };
  }

  shutdown(): RuntimeStartupResult {
    this.lifecycle.stopAll();

    this.status = "stopped";

    return {
      status: this.status,
      startedAt: new Date().toISOString(),
      services: this.registry.getAll(),
      errors: [],
    };
  }
}