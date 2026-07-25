import {
  OpportunityNextActionWorkflow,
} from "./opportunityNextActionWorkflow";

export type OpportunityNextActionRuntime = {
  workflow: OpportunityNextActionWorkflow;
};

export function createOpportunityNextActionRuntime():
  OpportunityNextActionRuntime {
  return {
    workflow:
      new OpportunityNextActionWorkflow(),
  };
}

export const opportunityNextActionRuntime =
  createOpportunityNextActionRuntime();
