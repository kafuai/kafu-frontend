import {
  EnterpriseIntelligenceStatus,
} from "../types/enterpriseIntelligenceTypes";

export interface EnterpriseIntelligenceContract {
  readonly name: string;

  initialize(): Promise<void>;

  dispose(): Promise<void>;

  getStatus(): EnterpriseIntelligenceStatus;

  validate(): boolean;
}