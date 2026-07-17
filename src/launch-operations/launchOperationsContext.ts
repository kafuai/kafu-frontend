import { LaunchOperationsRecord } from "./launchOperationsTypes";

export interface LaunchOperationsContext {
  launch: LaunchOperationsRecord;
  launchObjectives: string[];
  operationalRisks: string[];
  escalationContacts: string[];
  notes: string[];
}
