import {
  BusinessContinuityCriticalService,
  BusinessContinuityCriticality,
} from "./businessContinuityTypes";

const criticalityScore: Record<BusinessContinuityCriticality, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
  mission_critical: 5,
};

export function createCriticalBusinessService(
  service: BusinessContinuityCriticalService,
): BusinessContinuityCriticalService {
  return {
    ...service,
    enabled: service.enabled ?? true,
  };
}

export function rankCriticalBusinessServices(
  services: BusinessContinuityCriticalService[],
): BusinessContinuityCriticalService[] {
  return [...services].sort((left, right) => {
    const criticalityDelta =
      criticalityScore[right.criticality] - criticalityScore[left.criticality];

    if (criticalityDelta !== 0) {
      return criticalityDelta;
    }

    return left.recoveryObjective.rto - right.recoveryObjective.rto;
  });
}

export function findMissionCriticalServices(
  services: BusinessContinuityCriticalService[],
): BusinessContinuityCriticalService[] {
  return services.filter(
    (service) =>
      service.enabled &&
      (service.criticality === "mission_critical" ||
        service.criticality === "critical"),
  );
}

export function isServiceRecoveryObjectiveStrict(
  service: BusinessContinuityCriticalService,
): boolean {
  return service.recoveryObjective.rto <= 4 && service.recoveryObjective.rpo <= 1;
}