import { RuntimeRegistry } from "./runtimeRegistry";

export class RuntimeValidator {
  validate(registry: RuntimeRegistry): string[] {
    const errors: string[] = [];

    if (registry.count() === 0) {
      errors.push("Runtime has no registered services.");
    }

    return errors;
  }
}