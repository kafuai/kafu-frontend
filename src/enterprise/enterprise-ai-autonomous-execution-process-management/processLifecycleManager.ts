import { EnterpriseAIProcessStatus } from "./process.enums";
import { EnterpriseAIProcess } from "./process.types";

export class EnterpriseAIProcessLifecycleManager {
  activate(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return {
      ...process,
      status: EnterpriseAIProcessStatus.ACTIVE,
      updatedAt: new Date().toISOString(),
    };
  }

  pause(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return {
      ...process,
      status: EnterpriseAIProcessStatus.PAUSED,
      updatedAt: new Date().toISOString(),
    };
  }

  block(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return {
      ...process,
      status: EnterpriseAIProcessStatus.BLOCKED,
      updatedAt: new Date().toISOString(),
    };
  }

  complete(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return {
      ...process,
      status: EnterpriseAIProcessStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    };
  }

  fail(process: EnterpriseAIProcess): EnterpriseAIProcess {
    return {
      ...process,
      status: EnterpriseAIProcessStatus.FAILED,
      updatedAt: new Date().toISOString(),
    };
  }
}