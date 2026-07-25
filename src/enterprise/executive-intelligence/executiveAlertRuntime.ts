import {
  getExecutiveKpiSnapshot,
} from "./executiveRuntime";

import {
  createExecutiveAlertSnapshot,
} from "./executiveAlertEngine";

import type {
  ExecutiveAlertSnapshot,
} from "./executiveAlertTypes";

export interface ExecutiveAlertRuntime {
  getSnapshot(): Promise<ExecutiveAlertSnapshot>;
}

export function createExecutiveAlertRuntime(): ExecutiveAlertRuntime {
  return {
    async getSnapshot(): Promise<ExecutiveAlertSnapshot> {
      const kpiSnapshot =
        await getExecutiveKpiSnapshot();

      return createExecutiveAlertSnapshot(
        kpiSnapshot,
      );
    },
  };
}

const executiveAlertRuntime =
  createExecutiveAlertRuntime();

export async function getExecutiveAlertSnapshot(): Promise<ExecutiveAlertSnapshot> {
  return executiveAlertRuntime.getSnapshot();
}