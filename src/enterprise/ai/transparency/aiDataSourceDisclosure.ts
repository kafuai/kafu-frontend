export interface AIDataSourceDisclosure {
  id: string;
  transparencyRecordId: string;
  sourceName: string;
  sourceType: string;
  description: string;
  containsPersonalData: boolean;
  externallyProvided: boolean;
  verified: boolean;
  createdAt: Date;
}

export interface CreateAIDataSourceDisclosureInput {
  id: string;
  transparencyRecordId: string;
  sourceName: string;
  sourceType: string;
  description: string;
  containsPersonalData?: boolean;
  externallyProvided?: boolean;
  verified?: boolean;
}

export function createAIDataSourceDisclosure(
  input: CreateAIDataSourceDisclosureInput,
): AIDataSourceDisclosure {
  return {
    id: input.id,
    transparencyRecordId: input.transparencyRecordId,
    sourceName: input.sourceName,
    sourceType: input.sourceType,
    description: input.description,
    containsPersonalData: input.containsPersonalData ?? false,
    externallyProvided: input.externallyProvided ?? false,
    verified: input.verified ?? false,
    createdAt: new Date(),
  };
}