"use client";

import { useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldAlert,
  User as UserIcon,
  EyeOff,
  Eye,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { validatePassword } from "@/lib/passwordValidation";

const CONTENT = {
  ar: {
    title: "إنشاء مؤسسة جديدة",
    subtitle: "ينشئ هذا النموذج مؤسسة وشركة ومستخدمًا (Owner) تلقائيًا ومرتبطين ببعض.",
    labels: {
      companyName: "اسم المؤسسة / الشركة",
      companyPlaceholder: "مثال: شركة الرياض للتقنية",
      fullName: "الاسم الكامل للمستخدم (Owner)",
      fullNamePlaceholder: "مثال: أحمد المطيري",
      email: "البريد الإلكتروني",
      password: "كلمة المرور (٨ أحرف على الأقل)",
    },
    buttons: {
      submit: "إنشاء المؤسسة والمستخدم",
    },
    messages: {
      forbidden: "هذه الصفحة متاحة فقط لمسؤول المنصة.",
      genericError: "تعذر إنشاء المؤسسة.",
      success: "تم إنشاء المؤسسة والمستخدم بنجاح. البريد:",
      requiredFields: "جميع الحقول مطلوبة.",
      invalidEmail: "صيغة البريد الإلكتروني غير صحيحة.",
      paaswordLength: "يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.",
      passwordLetter: "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل.",
      passwordNumber: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.",
      passwordWhitespace: "لا يمكن أن تحتوي كلمة المرور على مسافات.",
      englishOnly: "يجب أن تحتوي كلمة المرور على أحرف إنجليزية فقط.",
    },
    form: {
      showPassword: "إظهار كلمة المرور",
      hidePassword: "إخفاء كلمة المرور",
    },
  },
  en: {
    title: "Create New Organization",
    subtitle: "This form automatically creates an organization, a company, and an Owner user, linking them together.",
    labels: {
      companyName: "Organization / Company Name",
      companyPlaceholder: "e.g., Acme Corporation",
      fullName: "Full Name (Owner)",
      fullNamePlaceholder: "e.g., John Doe",
      email: "Email Address",
      password: "Password (min 8 characters)",
    },
    buttons: {
      submit: "Create Organization & User",
    },
    messages: {
      forbidden: "This page is restricted to platform administrators.",
      genericError: "Failed to create organization.",
      success: "Organization and user created successfully. Email:",
      requiredFields: "All fields are required.",
      invalidEmail: "Invalid email format.",
      paaswordLength: "Password must be at least 8 characters.",
      passwordLetter: "Password must contain at least one letter.",
      passwordNumber: "Password must contain at least one number.",
      passwordWhitespace: "Password cannot contain spaces.",
      englishOnly: "Password must contain only English characters.",
    },
    form: {
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
  },
} as const;

export default function AdminOrganizationsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName || !companyName || !email || !password) {
      setErrorMessage(t.messages.requiredFields);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(t.messages.invalidEmail);
      return;
    }
    
    const passwordValidation = validatePassword(password);

    if (!passwordValidation.valid) {
      switch (passwordValidation.reason) {
        case "too_short":
          setErrorMessage(t.messages.paaswordLength);
          break;

        case "letter_required":
          setErrorMessage(t.messages.passwordLetter);
          break;

        case "number_required":
          setErrorMessage(t.messages.passwordNumber);
          break;

        case "whitespace_not_allowed":
          setErrorMessage(t.messages.passwordWhitespace);
          break;

        case "english_only":
          setErrorMessage(t.messages.englishOnly);
          break;
      }
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          password,
        }),
      });

      const payload = await response.json();

      if (response.status === 403) {
        throw new Error(t.messages.forbidden);
      }

      if (!response.ok) {
        throw new Error(payload.error ?? t.messages.genericError);
      }

      setSuccessMessage(`${t.messages.success} ${payload.data.email}`);

      setFullName("");
      setCompanyName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t.messages.genericError
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-8 sm:px-6 text-start"
    >
      <div className="mx-auto max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t.subtitle}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6"
          noValidate
        >
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
              <Building2 size={14} />
              {t.labels.companyName}
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder={t.labels.companyPlaceholder}
              className="h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
              <UserIcon size={14} />
              {t.labels.fullName}
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder={t.labels.fullNamePlaceholder}
              className="h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
              <Mail size={14} />
              {t.labels.email}
            </label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@company.com"
              className={`h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] ${
                isArabic ? "text-right" : "text-left"
              }`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">
              {t.labels.password}
            </label>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={`h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] ${isArabic ? "text-right" : "text-left"}`}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? t.form.hidePassword : t.form.showPassword}
                  aria-pressed={showPassword}
                  className={`absolute top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${isArabic ? "left-3" : "right-3"}`}
                >
                  {showPassword ? <Eye className="h-5 w-5" />: <EyeOff className="h-5 w-5" />}
                </button>
              </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] text-sm font-extrabold text-white transition disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t.buttons.submit
            )}
          </button>
        </form>
      </div>
    </main>
  );
}