export type PlatformConfigurationField = {
  key: string;
  required: boolean;
  defaultValue?: string | number | boolean;
};

export class PlatformConfigurationSchema {
  constructor(
    public readonly fields: PlatformConfigurationField[],
  ) {}

  requiredKeys(): string[] {
    return this.fields
      .filter((field) => field.required)
      .map((field) => field.key);
  }
}