import { EnterpriseDIContainer } from "./enterpriseDIContainer";

export class EnterpriseDIValidator {
  validate(container: EnterpriseDIContainer): string[] {
    const errors: string[] = [];

    for (const token of container.getProviderTokens()) {
      const provider = container.getProvider(token);

      if (!provider) {
        errors.push(`DI provider not found for token: ${String(token)}`);
        continue;
      }

      if (!provider.useValue && !provider.useFactory) {
        errors.push(`DI provider missing implementation: ${String(token)}`);
      }
    }

    return errors;
  }
}