import {
  getExecutiveAlertSnapshot,
} from "./executiveAlertRuntime";

import {
  getExecutiveKpiSnapshot,
} from "./executiveRuntime";

import {
  composeExecutiveBriefing,
} from "./executiveBriefingComposer";

import type {
  ExecutiveBriefing,
} from "./executiveBriefingTypes";

export interface ExecutiveBriefingRuntime {
  getBriefing(): Promise<ExecutiveBriefing>;
}

export function createExecutiveBriefingRuntime(): ExecutiveBriefingRuntime {
  return {
    async getBriefing(): Promise<ExecutiveBriefing> {
      const [
        kpiSnapshot,
        alertSnapshot,
      ] = await Promise.all([
        getExecutiveKpiSnapshot(),
        getExecutiveAlertSnapshot(),
      ]);

      return composeExecutiveBriefing(
        kpiSnapshot,
        alertSnapshot,
      );
    },
  };
}

const executiveBriefingRuntime =
  createExecutiveBriefingRuntime();

export async function getExecutiveBriefing(): Promise<ExecutiveBriefing> {
  return executiveBriefingRuntime.getBriefing();
}