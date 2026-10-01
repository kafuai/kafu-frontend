"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldAlert } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";

const CONTENT = {
  ar: {
    back: "الرجوع للملف الشخصي",
    badge: "الأمان",
    title: "تغيير كلمة المرور",
    description: "أدخل كلمة مرورك الحالية ثم اختر كلمة مرور جديدة قوية.",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    match: "كلمتا المرور متطابقتان.",
    noMatch: "كلمتا المرور غير متطابقتين.",
    tooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    samePassword: "كلمة المرور الجديدة يجب أن تختلف عن الحالية.",
    wrongCurrentPassword: "كلمة المرور الحالية غير صحيحة.",
    genericError: "تعذر تحديث كلمة المرور.",
    noSession: "لم يتم العثور على جلسة مستخدم نشطة.",
    success: "تم تحديث كلمة المرور بنجاح.",
    submit: "تحديث كلمة المرور",
    submitting: "جارٍ تحديث كلمة المرور...",
    englishOnly: "يجب أن تكون كلمة المرور باللغة الإنجليزية ولا تحتوي على أحرف عربية.",
  },
  en: {
    back: "Back to profile",
    badge: "Security",
    title: "Change Password",
    description: "Enter your current password, then choose a new strong password.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    match: "Passwords match.",
    noMatch: "Passwords do not match.",
    tooShort: "Password must be at least 8 characters.",
    samePassword: "New password must be different from the current one.",
    wrongCurrentPassword: "Current password is incorrect.",
    genericError: "Unable to update password.",
    noSession: "No active user session found.",
    success: "Password updated successfully.",
    submit: "Update Password",
    submitting: "Updating password...",
     englishOnly: "Password must be in English and cannot contain Arabic characters.",
  },
} as const;

export default function ChangePasswordPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(t.tooShort);
      return;
    }

    const isEnglishOnly = /^[\x20-\x7E]*$/.test(password);
    if (!isEnglishOnly) {
       setErrorMessage(t.englishOnly);
       return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t.noMatch);
      return;
    }

    if (currentPassword === password) {
      setErrorMessage(t.samePassword);
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      const email = session?.user?.email;

      if (!email) {
        throw new Error(t.noSession);
      }

      const { error: verifyError } =
        await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        });

      if (verifyError) {
        setErrorMessage(t.wrongCurrentPassword);
        setIsSubmitting(false);
        return;
      }

      // بعد التحقق، نحدّث كلمة المرور فعليًا
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccessMessage(t.success);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-5 py-10 text-[var(--text-primary)] sm:px-8"
    >
      <div className="mx-auto max-w-lg">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition hover:text-[var(--brand-primary)]"
        >
          {isArabic ? (
            <ArrowRight size={16} />
          ) : (
            <ArrowLeft size={16} />
          )}
          {t.back}
        </Link>

        <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-small)]">
          <p className="text-sm font-black uppercase tracking-wider text-[var(--brand-primary)]">
            {t.badge}
          </p>
          <h1 className="mt-2 text-2xl font-black text-[var(--text-primary)]">
            {t.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {t.description}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1.5 block text-sm font-bold text-[var(--text-primary)]"
              >
                {t.currentPassword}
              </label>

              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  dir={isArabic ? "rtl" : "ltr"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 pe-12 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute end-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--background)]"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--border-default)] pt-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-bold text-[var(--text-primary)]"
              >
                {t.newPassword}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  dir={isArabic ? "rtl" : "ltr"}
                  value={password}
                  onChange={(e) => {
                    const englishOnlyValue = e.target.value.replace(/[^\x20-\x7E]/g, "");
                    setPassword(englishOnlyValue);
                }}
                  className="h-12 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 pe-12 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute end-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--background)]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-bold text-[var(--text-primary)]"
              >
                {t.confirmPassword}
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  dir={isArabic ? "rtl" : "ltr"}
                  value={confirmPassword}
                  onChange={(e) => {
                    const englishOnlyValue = e.target.value.replace(/[^\x20-\x7E]/g, "");
                    setConfirmPassword(englishOnlyValue);
                }}
                  className="h-12 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 pe-12 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute end-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--background)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPassword ? (
                <p
                  className={`mt-1.5 text-xs font-bold ${
                    password === confirmPassword
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {password === confirmPassword ? t.match : t.noMatch}
                </p>
              ) : null}
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}