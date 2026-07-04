import { EnterpriseAIProcessManagementService } from "./processManagementService";
import { EnterpriseAIProcessReadinessAssessor } from "./processReadinessAssessor";
import {
  EnterpriseAIProcessExecutionPlan,
  EnterpriseAIProcessExecutionPlanner,
} from "./processExecutionPlanner";
import {
  EnterpriseAIProcessGovernanceDecision,
  EnterpriseAIProcessGovernanceGuard,
} from "./processGovernanceGuard";
import {
  EnterpriseAIProcessTelemetryCollector,
  EnterpriseAIProcessTelemetrySnapshot,
} from "./processTelemetryCollector";
import {
  EnterpriseAIProcessOperationalReport,
  EnterpriseAIProcessOperationalReporter,
} from "./processOperationalReporter";
import {
  EnterpriseAIProcess,
  EnterpriseAIProcessHealth,
  EnterpriseAIProcessId,
} from "./process.types";
import { EnterpriseAIProcessOptimizationSignal } from "./processOptimizationAnalyzer";

export class EnterpriseAIProcessManagementFacade {
  private readonly service = new EnterpriseAIProcessManagementService();
  private readonly readinessAssessor = new EnterpriseAIProcessReadinessAssessor();
  private readonly executionPlanner = new EnterpriseAIProcessExecutionPlanner();
  private readonly governanceGuard = new EnterpriseAIProcessGovernanceGuard();
  private readonly telemetryCollector = new EnterpriseAIProcessTelemetryCollector();
  private readonly operationalReporter = new EnterpriseAIProcessOperationalReporter();

  register(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return this.service.registerProcess(process);
  }

  update(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return this.service.updateProcess(process);
  }

  get(processId: EnterpriseAIProcessId): EnterpriseAIProcess | undefined {
    return this.service.getProcess(processId);
  }

  list(): EnterpriseAIProcess[] {
    return this.service.listProcesses();
  }

  activate(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    return this.service.activateProcess(processId);
  }

  pause(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    return this.service.pauseProcess(processId);
  }

  block(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    return this.service.blockProcess(processId);
  }

  complete(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    return this.service.completeProcess(processId);
  }

  fail(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    return this.service.failProcess(processId);
  }

  evaluateHealth(processId: EnterpriseAIProcessId): EnterpriseAIProcessHealth {
    return this.service.evaluateProcessHealth(processId);
  }

  analyzeOptimization(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessOptimizationSignal[] {
    return this.service.analyzeOptimizationSignals(processId);
  }

  createExecutionPlan(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessExecutionPlan {
    const process = this.requireProcess(processId);
    return this.executionPlanner.createPlan(process);
  }

  evaluateGovernance(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessGovernanceDecision {
    const process = this.requireProcess(processId);
    return this.governanceGuard.evaluate(process);
  }

  collectTelemetry(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessTelemetrySnapshot {
    const process = this.requireProcess(processId);
    return this.telemetryCollector.collect(process);
  }

  createOperationalReport(
    processId: EnterpriseAIProcessId,
  ): EnterpriseAIProcessOperationalReport {
    const process = this.requireProcess(processId);
    const telemetry = this.telemetryCollector.collect(process);

    return this.operationalReporter.createReport(process, telemetry);
  }

  private requireProcess(processId: EnterpriseAIProcessId): EnterpriseAIProcess {
    const process = this.service.getProcess(processId);

    if (!process) {
      throw new Error(`Process not found: ${processId}`);
    }

    return process;
  }
}