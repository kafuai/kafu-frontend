import {
  createExecutiveAlertSnapshot,
} from "./executiveAlertEngine";

import {
  composeExecutiveBriefing,
} from "./executiveBriefingComposer";

import {
  createExecutiveDecisionSnapshot,
} from "./executiveDecisionEngine";

import type {
  ExecutiveDecisionSnapshot,
} from "./executiveDecisionTypes";

import {
  getExecutiveKpiSnapshot,
} from "./executiveRuntime";

export interface ExecutiveDecisionRuntime {
  getSnapshot(): Promise<ExecutiveDecisionSnapshot>;
}

export function createExecutiveDecisionRuntime(): ExecutiveDecisionRuntime {
  return {
    async getSnapshot(): Promise<ExecutiveDecisionSnapshot> {
      const kpiSnapshot =
        await getExecutiveKpiSnapshot();

      const alertSnapshot =
        createExecutiveAlertSnapshot(
          kpiSnapshot,
        );

      const briefing =
        composeExecutiveBriefing(
          kpiSnapshot,
          alertSnapshot,
        );

      return createExecutiveDecisionSnapshot(
        kpiSnapshot,
        alertSnapshot,
        briefing,
      );
    },
  };
}

const executiveDecisionRuntime =
  createExecutiveDecisionRuntime();

export async function getExecutiveDecisionSnapshot(): Promise<ExecutiveDecisionSnapshot> {
  return executiveDecisionRuntime.getSnapshot();
}