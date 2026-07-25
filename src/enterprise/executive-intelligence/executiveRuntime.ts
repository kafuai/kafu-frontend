import {
  getSalesIntelligenceSnapshot,
} from "../sales-intelligence/salesIntelligenceRepository";

import {
  createExecutiveKpiSnapshot,
} from "./executiveSnapshot";

import type {
  ExecutiveKpiSnapshot,
} from "./executiveKpiTypes";

export interface ExecutiveKpiRuntime {
  getSnapshot(): Promise<ExecutiveKpiSnapshot>;
}

export function createExecutiveKpiRuntime(): ExecutiveKpiRuntime {
  return {
    async getSnapshot(): Promise<ExecutiveKpiSnapshot> {
      const salesSnapshot =
        await getSalesIntelligenceSnapshot();

      return createExecutiveKpiSnapshot(salesSnapshot);
    },
  };
}

const executiveKpiRuntime =
  createExecutiveKpiRuntime();

export async function getExecutiveKpiSnapshot(): Promise<ExecutiveKpiSnapshot> {
  return executiveKpiRuntime.getSnapshot();
}