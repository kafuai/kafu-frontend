import {
  EnterprisePlanningConstraint,
  EnterprisePlanningGoal,
  EnterprisePlanningResource,
  EnterprisePlanningRisk,
} from "./enterpriseAIPlanningEngineTypes";

export interface EnterpriseAIPlanningEngineInput {
  organizationId: string;
  planningId: string;
  title: string;
  description: string;
  goals: EnterprisePlanningGoal[];
  constraints: EnterprisePlanningConstraint[];
  availableResources: EnterprisePlanningResource[];
  knownRisks: EnterprisePlanningRisk[];
  requestedBy: string;
  createdAt: string;
}