export type CrisisPlanStep = {
  id: string;
  title: string;
  description: string;
  order: number;
  ownerRole: string;
  automated?: boolean;
};

export type CrisisPlan = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  supportedScenarios: string[];
  steps: CrisisPlanStep[];
  version: string;
  active: boolean;
};