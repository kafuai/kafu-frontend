"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
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
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!emailPattern.test(form.workEmail.trim())) {
      nextErrors.workEmail = "Please enter a valid work email.";
    }

    if (form.organization.trim().length < 2) {
      nextErrors.organization = "Please enter your organization.";
    }

    if (form.role.trim().length < 2) {
      nextErrors.role = "Please enter your role.";
    }

    if (!form.companySize) {
      nextErrors.companySize = "Please select your organization size.";
    }

    if (!form.interest) {
      nextErrors.interest = "Please select the primary conversation type.";
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
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "We could not submit your request. Please try again."
        );
      }

      router.push("/thank-you");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="demo-form" onSubmit={handleSubmit} noValidate>
      <div className="demo-form__grid">
        <div className="form-field">
          <label htmlFor="fullName">Full name</label>

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
          <label htmlFor="workEmail">Work email</label>

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
          <label htmlFor="organization">Organization</label>

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
          <label htmlFor="role">Role</label>

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
          <label htmlFor="companySize">Organization size</label>

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
            <option value="">Select size</option>
            <option value="1-49">1–49 employees</option>
            <option value="50-249">50–249 employees</option>
            <option value="250-999">250–999 employees</option>
            <option value="1000-4999">1,000–4,999 employees</option>
            <option value="5000+">5,000+ employees</option>
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
          <label htmlFor="interest">Conversation type</label>

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
            <option value="">Select conversation</option>
            <option value="executive-demo">Executive Demo</option>
            <option value="enterprise-briefing">
              Enterprise Briefing
            </option>
            <option value="strategic-partnership">
              Strategic Partnership
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
            What would you like to discuss?
            <span> Optional</span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={6}
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder="Tell us about your strategic priorities, operational challenges, or AI transformation objectives."
          />
        </div>
      </div>

      {submitError && (
        <div className="demo-form__alert" role="alert">
          <strong>Submission unavailable</strong>
          <span>{submitError}</span>
          <a href="mailto:hello@kafu.ai">
            Contact hello@kafu.ai directly
          </a>
        </div>
      )}

      <div className="demo-form__footer">
        <p>
          By submitting this form, you agree that KAFU AI may contact
          you regarding your request.
        </p>

        <button
          className="website-button website-button--primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting request..." : "Request Executive Demo"}
        </button>
      </div>
    </form>
  );
}