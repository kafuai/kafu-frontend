import {
  EnterpriseDemoFlowStep,
  EnterpriseDemoScenario,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContextSnapshot,
} from "./enterpriseDemoRuntimeContext";

export interface EnterpriseDemoRuntimeExecutionGuardInput {
  context: EnterpriseDemoRuntimeContextSnapshot;
  scenario: EnterpriseDemoScenario;
  steps: EnterpriseDemoFlowStep[];
  initiatedBy: string;
}

export class EnterpriseDemoRuntimeExecutionGuard {
  validate(
    input: EnterpriseDemoRuntimeExecutionGuardInput,
  ): void {
    if (
      input.context.status !== "ready" &&
      input.context.status !== "completed"
    ) {
      throw new Error(
        `Enterprise demo runtime cannot execute while status is ${input.context.status}.`,
      );
    }

    if (!input.initiatedBy.trim()) {
      throw new Error(
        "Enterprise demo runtime initiatedBy is required.",
      );
    }

    if (
      input.scenario.organizationId !==
      input.context.configuration.organizationId
    ) {
      throw new Error(
        "Enterprise demo scenario organization does not match runtime configuration.",
      );
    }

    if (
      input.scenario.status === "disabled" ||
      input.scenario.status === "failed"
    ) {
      throw new Error(
        `Enterprise demo scenario ${input.scenario.id} is not executable.`,
      );
    }

    if (input.steps.length === 0) {
      throw new Error(
        "Enterprise demo runtime requires at least one flow step.",
      );
    }

    const stepIds = new Set<string>();
    const sequences = new Set<number>();

    for (const step of input.steps) {
      if (!step.id.trim()) {
        throw new Error(
          "Enterprise demo flow step id is required.",
        );
      }

      if (!step.title.trim()) {
        throw new Error(
          `Enterprise demo flow step ${step.id} title is required.`,
        );
      }

      if (!step.module.trim()) {
        throw new Error(
          `Enterprise demo flow step ${step.id} module is required.`,
        );
      }

      if (!step.action.trim()) {
        throw new Error(
          `Enterprise demo flow step ${step.id} action is required.`,
        );
      }

      if (!Number.isFinite(step.sequence)) {
        throw new Error(
          `Enterprise demo flow step ${step.id} sequence must be finite.`,
        );
      }

      if (stepIds.has(step.id)) {
        throw new Error(
          `Duplicate enterprise demo flow step id ${step.id}.`,
        );
      }

      if (sequences.has(step.sequence)) {
        throw new Error(
          `Duplicate enterprise demo flow step sequence ${step.sequence}.`,
        );
      }

      stepIds.add(step.id);
      sequences.add(step.sequence);
    }
  }
}
