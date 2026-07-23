"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useWebsiteTranslations } from "@/components/localization";

type FormState = {
  fullName: string;
  workEmail: string;
  organization: string;
  role: string;
  companySize: string;
  interest: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  fullName: "",
  workEmail: "",
  organization: "",
  role: "",
  companySize: "",
  interest: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DemoRequestForm() {
  const router = useRouter();
  const { translations, direction } = useWebsiteTranslations();
  const content = translations.form;

  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError("");
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = content.validation.fullName;
    }

    if (!emailPattern.test(form.workEmail.trim())) {
      nextErrors.workEmail = content.validation.workEmail;
    }

    if (form.organization.trim().length < 2) {
      nextErrors.organization = content.validation.organization;
    }

    if (form.role.trim().length < 2) {
      nextErrors.role = content.validation.role;
    }

    if (!form.companySize) {
      nextErrors.companySize = content.validation.companySize;
    }

    if (!form.interest) {
      nextErrors.interest = content.validation.interest;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        success?: boolean;
      };

      if (!response.ok || !result.success) {
        throw new Error(content.submission.errorMessage);
      }

      router.push("/thank-you");
    } catch {
      setSubmitError(content.submission.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="demo-form"
      onSubmit={handleSubmit}
      noValidate
      dir={direction}
    >
      <div className="demo-form__grid">
        <div className="form-field">
          <label htmlFor="fullName">{content.fields.fullName}</label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) =>
              updateField("fullName", event.target.value)
            }
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={
              errors.fullName ? "fullName-error" : undefined
            }
          />

          {errors.fullName && (
            <span className="form-field__error" id="fullName-error">
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="workEmail">{content.fields.workEmail}</label>

          <input
            id="workEmail"
            name="workEmail"
            type="email"
            autoComplete="email"
            value={form.workEmail}
            onChange={(event) =>
              updateField("workEmail", event.target.value)
            }
            aria-invalid={Boolean(errors.workEmail)}
            aria-describedby={
              errors.workEmail ? "workEmail-error" : undefined
            }
          />

          {errors.workEmail && (
            <span className="form-field__error" id="workEmail-error">
              {errors.workEmail}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="organization">
            {content.fields.organization}
          </label>

          <input
            id="organization"
            name="organization"
            type="text"
            autoComplete="organization"
            value={form.organization}
            onChange={(event) =>
              updateField("organization", event.target.value)
            }
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={
              errors.organization ? "organization-error" : undefined
            }
          />

          {errors.organization && (
            <span
              className="form-field__error"
              id="organization-error"
            >
              {errors.organization}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="role">{content.fields.role}</label>

          <input
            id="role"
            name="role"
            type="text"
            autoComplete="organization-title"
            value={form.role}
            onChange={(event) =>
              updateField("role", event.target.value)
            }
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? "role-error" : undefined}
          />

          {errors.role && (
            <span className="form-field__error" id="role-error">
              {errors.role}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="companySize">
            {content.fields.companySize}
          </label>

          <select
            id="companySize"
            name="companySize"
            value={form.companySize}
            onChange={(event) =>
              updateField("companySize", event.target.value)
            }
            aria-invalid={Boolean(errors.companySize)}
            aria-describedby={
              errors.companySize ? "companySize-error" : undefined
            }
          >
            <option value="">
              {content.companySizes.placeholder}
            </option>

            <option value="1-49">{content.companySizes.size1}</option>
            <option value="50-249">{content.companySizes.size2}</option>
            <option value="250-999">{content.companySizes.size3}</option>
            <option value="1000-4999">{content.companySizes.size4}</option>
            <option value="5000+">{content.companySizes.size5}</option>
          </select>

          {errors.companySize && (
            <span
              className="form-field__error"
              id="companySize-error"
            >
              {errors.companySize}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="interest">{content.fields.interest}</label>

          <select
            id="interest"
            name="interest"
            value={form.interest}
            onChange={(event) =>
              updateField("interest", event.target.value)
            }
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={
              errors.interest ? "interest-error" : undefined
            }
          >
            <option value="">
              {content.interests.placeholder}
            </option>

            <option value="executive-discovery">
              {content.interests.executiveDiscovery}
            </option>

            <option value="enterprise-readiness">
              {content.interests.enterpriseReadiness}
            </option>

            <option value="strategic-partnership">
              {content.interests.strategicPartnership}
            </option>
          </select>

          {errors.interest && (
            <span className="form-field__error" id="interest-error">
              {errors.interest}
            </span>
          )}
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="message">
            {content.fields.message}
            <span> {content.fields.optional}</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={6}
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder={content.placeholders.message}
          />
        </div>
      </div>

      {submitError && (
        <div
          className="demo-form__alert"
          role="alert"
          aria-live="polite"
        >
          <strong>{content.submission.errorTitle}</strong>
          <span>{submitError}</span>

          <a href="mailto:hello@kafu.ai">
            {content.submission.directContact}
          </a>
        </div>
      )}

      <div className="demo-form__footer">
        <p>{content.submission.consent}</p>

        <button
          className="website-button website-button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? content.submission.submitting
            : content.submission.submit}
        </button>
      </div>
    </form>
  );
}
