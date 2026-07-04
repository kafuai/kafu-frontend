import { EnterpriseAIProcessManagementCapability } from "./process.interface";
import {
  EnterpriseAIProcess,
  EnterpriseAIProcessHealth,
  EnterpriseAIProcessId,
} from "./process.types";
import { EnterpriseAIProcessRegistry } from "./processRegistry";
import { EnterpriseAIProcessHealthEvaluator } from "./processHealthEvaluator";
import { EnterpriseAIProcessLifecycleManager } from "./processLifecycleManager";
import {
  EnterpriseAIProcessOptimizationAnalyzer,
  EnterpriseAIProcessOptimizationSignal,
} from "./processOptimizationAnalyzer";

export class EnterpriseAIProcessManagementService
  implements EnterpriseAIProcessManagementCapability
{
  private readonly registry = new EnterpriseAIProcessRegistry();
  private readonly healthEvaluator = new EnterpriseAIProcessHealthEvaluator();
  private readonly lifecycleManager = new EnterpriseAIProcessLifecycleManager();
  private readonly optimizationAnalyzer = new EnterpriseAIProcessOptimizationAnalyzer();

  registerProcess(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return this.registry.register(process);
  }

  updateProcess(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return this.registry.update({
      ...process,
      updatedAt: new Date().toISOString(),
    });
  }

  getProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess | undefined {
    return this.registry.get(processId);
  }

  listProcesses(): EnterpriseAIProcess[] {
    return this.registry.list();
  }

  evaluateProcessHealth(processId: EnterpriseAIProcessId): EnterpriseAIProcessHealth {
    const process = this.registry.get(processId);

    if (!process) {
      throw new Error(`Process not found: ${processId}`);
    }

    return this.healthEvaluator.evaluate(process);
  }

  activateProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.requireProcess(processId);
    return this.registry.update(this.lifecycleManager.activate(process));
  }

  pauseProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.requireProcess(processId);
    return this.registry.update(this.lifecycleManager.pause(process));
  }

  blockProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.requireProcess(processId);
    return this.registry.update(this.lifecycleManager.block(process));
  }

  completeProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.requireProcess(processId);
    return this.registry.update(this.lifecycleManager.complete(process));
  }

  failProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.requireProcess(processId);
    return this.registry.update(this.lifecycleManager.fail(process));
  }

  analyzeOptimizationSignals(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessOptimizationSignal[] {
    const process = this.requireProcess(processId);
    return this.optimizationAnalyzer.analyze(process);
  }

  private requireProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.registry.get(processId);

    if (!process) {
      throw new Error(`Process not found: ${processId}`);
    }

    return process;
  }
}