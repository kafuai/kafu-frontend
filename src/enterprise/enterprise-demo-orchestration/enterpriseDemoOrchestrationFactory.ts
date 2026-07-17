import { EnterpriseDemoOrchestrationCoordinator } from "./enterpriseDemoOrchestrationCoordinator";
import { EnterpriseDemoOrchestrationService } from "./enterpriseDemoOrchestrationService";

export interface EnterpriseDemoOrchestrationFactoryResult {
  service: EnterpriseDemoOrchestrationService;
  coordinator: EnterpriseDemoOrchestrationCoordinator;
}

export function createEnterpriseDemoOrchestration():
  EnterpriseDemoOrchestrationFactoryResult {
  const service = new EnterpriseDemoOrchestrationService();
  const coordinator =
    new EnterpriseDemoOrchestrationCoordinator(service);

  return {
    service,
    coordinator,
  };
}
