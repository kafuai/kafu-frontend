import type {
  EmailTemplate,
  EmailTemplateValues,
  RenderedEmailTemplate,
} from "./emailTemplateTypes";

const VARIABLE_PATTERN =
  /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function resolveValue(
  key: string,
  values: EmailTemplateValues,
  fallbackValue?: string,
): string {
  const value = values[key];

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallbackValue ?? "";
  }

  return String(value);
}

function renderContent(
  content: string,
  template: EmailTemplate,
  values: EmailTemplateValues,
): string {
  const fallbackValues = new Map(
    template.variables.map((variable) => [
      variable.key,
      variable.fallbackValue,
    ]),
  );

  return content.replace(
    VARIABLE_PATTERN,
    (_, key: string) =>
      resolveValue(
        key,
        values,
        fallbackValues.get(key),
      ),
  );
}

function validateRequiredVariables(
  template: EmailTemplate,
  values: EmailTemplateValues,
): void {
  const missingVariables = template.variables
    .filter(
      (variable) =>
        variable.required &&
        !variable.fallbackValue &&
        (
          values[variable.key] === undefined ||
          values[variable.key] === null ||
          values[variable.key] === ""
        ),
    )
    .map((variable) => variable.key);

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required email template variables: ${missingVariables.join(", ")}`,
    );
  }
}

export function renderEmailTemplate(
  template: EmailTemplate,
  values: EmailTemplateValues,
): RenderedEmailTemplate {
  validateRequiredVariables(
    template,
    values,
  );

  return {
    subject: renderContent(
      template.subject,
      template,
      values,
    ),
    htmlBody: renderContent(
      template.htmlBody,
      template,
      values,
    ),
    textBody: renderContent(
      template.textBody,
      template,
      values,
    ),
  };
}
