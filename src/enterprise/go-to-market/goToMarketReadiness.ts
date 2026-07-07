export interface GoToMarketReadinessArea {
  name: string;
  ready: boolean;
  blockers: string[];
}

export interface GoToMarketReadinessAssessment {
  areas: GoToMarketReadinessArea[];
  readinessScore: number;
  readyForLaunch: boolean;
}

export function assessGoToMarketReadiness(
  areas: GoToMarketReadinessArea[],
): GoToMarketReadinessAssessment {
  const readyAreas = areas.filter((area) => area.ready).length;
  const readinessScore =
    areas.length === 0 ? 0 : Math.round((readyAreas / areas.length) * 100);

  return {
    areas,
    readinessScore,
    readyForLaunch: readinessScore >= 85,
  };
}