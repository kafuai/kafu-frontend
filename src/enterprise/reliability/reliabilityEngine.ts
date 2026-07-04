import { detectReliabilityFailures } from "./reliabilityFailureDetector";
import {
  ReliabilityAssessment,
  ReliabilityFailure,
  ReliabilityTarget,
} from "./reliabilityTypes";

export class ReliabilityEngine {
  assessTarget(
    target: ReliabilityTarget,
    failures: ReliabilityFailure[],
  ): ReliabilityAssessment {
    return detectReliabilityFailures(target, failures);
  }

  assessTargets(
    targets: ReliabilityTarget[],
    failures: ReliabilityFailure[],
  ): ReliabilityAssessment[] {
    return targets.map((target) => this.assessTarget(target, failures));
  }
}