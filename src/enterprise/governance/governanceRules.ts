import { GovernanceSubject } from "./governanceTypes";

export type GovernanceRule = {
  id: string;
  name: string;
  enabled: boolean;
  evaluate(subject: GovernanceSubject): boolean;
};