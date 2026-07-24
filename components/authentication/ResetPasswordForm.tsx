"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getBrowserAuthenticationService,
} from "../../src/enterprise/authentication/authenticationRuntime";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "كلمتا المرور غير متطابقتين.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await getBrowserAuthenticationService()
        .updatePassword(password);

      router.replace(
        "/login?password_updated=true",
      );
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحديث كلمة المرور.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div>
        <p className="text-sm font-bold text-emerald-700">
          كلمة مرور جديدة
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-950">
          حدّث كلمة المرور
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          اختر كلمة مرور قوية لحماية حسابك ومساحة عمل مؤسستك.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            كلمة المرور الجديدة
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pl-12 text-left text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              dir="ltr"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              aria-label={
                showPassword
                  ? "إخفاء كلمة المرور"
                  : "إظهار كلمة المرور"
              }
              aria-pressed={showPassword}
              className="absolute left-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <PasswordStrengthIndicator
            password={password}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            تأكيد كلمة المرور
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pl-12 text-left text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              dir="ltr"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showConfirmPassword
                  ? "إخفاء تأكيد كلمة المرور"
                  : "إظهار تأكيد كلمة المرور"
              }
              aria-pressed={showConfirmPassword}
              className="absolute left-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {confirmPassword ? (
            <p
              className={`mt-2 text-xs font-bold ${
                password === confirmPassword
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}
            >
              {password === confirmPassword
                ? "كلمتا المرور متطابقتان."
                : "كلمتا المرور غير متطابقتين."}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          {isSubmitting
            ? "جارٍ تحديث كلمة المرور..."
            : "اعتماد كلمة المرور الجديدة"}
        </button>
      </form>
    </div>
  );
}
