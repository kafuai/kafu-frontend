import {
  EnterpriseAIProcess,
  EnterpriseAIProcessHealth,
  EnterpriseAIProcessId,
} from "./process.types";

export interface EnterpriseAIProcessManagementCapability {
  registerProcess(process: EnterpriseAIProcess): EnterpriseAIProcess;
  updateProcess(process: EnterpriseAIProcess): EnterpriseAIProcess;
  getProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess | undefined;
  listProcesses(): EnterpriseAIProcess[];
  evaluateProcessHealth(processId: EnterpriseAIProcessId): EnterpriseAIProcessHealth;
}