import {
  EnterpriseAIProcess,
  EnterpriseAIProcessId,
} from "./process.types";

export class EnterpriseAIProcessRegistry {
  private readonly processes = new Map<
    EnterpriseAIProcessId,
    EnterpriseAIProcess
  >();

  register(process: EnterpriseAIProcess): EnterpriseAIProcess {
    this.processes.set(process.id, process);
    return process;
  }

  update(process: EnterpriseAIProcess): EnterpriseAIProcess {
    this.processes.set(process.id, process);
    return process;
  }

  get(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcess | undefined {
    return this.processes.get(processId);
  }

  list(): EnterpriseAIProcess[] {
    return [...this.processes.values()];
  }

  exists(processId: EnterpriseAIProcessId): boolean {
    return this.processes.has(processId);
  }

  remove(processId: EnterpriseAIProcessId): boolean {
    return this.processes.delete(processId);
  }

  clear(): void {
    this.processes.clear();
  }
}