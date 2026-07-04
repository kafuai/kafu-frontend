import { ReliabilityEngine } from "./reliabilityEngine";
import { ReliabilityRegistry } from "./reliabilityRegistry";
import { ReliabilityAssessment } from "./reliabilityTypes";

export class ReliabilityRuntime {
  constructor(
    private readonly registry: ReliabilityRegistry,
    private readonly engine: ReliabilityEngine,
  ) {}

  evaluate(): ReliabilityAssessment[] {
    return this.engine.assessTargets(
      this.registry.listTargets(),
      [],
    );
  }
}