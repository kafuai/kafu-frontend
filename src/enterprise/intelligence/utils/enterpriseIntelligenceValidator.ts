import { EnterpriseIntelligenceModel } from "../models/enterpriseIntelligenceModel";

export class EnterpriseIntelligenceValidator {
  validateModel(model: EnterpriseIntelligenceModel): boolean {
    return Boolean(
      model.id &&
        model.title &&
        model.description &&
        model.domain &&
        model.priority &&
        model.confidence &&
        model.createdAt &&
        model.updatedAt,
    );
  }
}