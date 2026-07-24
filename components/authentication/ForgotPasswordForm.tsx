"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";

import {
  getBrowserAuthenticationService,
} from "../../src/enterprise/authentication/authenticationRuntime";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");
  const [isSubmitted, setIsSubmitted] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const redirectTo =
        `${window.location.origin}/auth/callback` +
        "?next=/reset-password";

      await getBrowserAuthenticationService()
        .requestPasswordReset(
          email.trim(),
          redirectTo,
        );

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر إرسال رابط استعادة كلمة المرور.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-bold text-emerald-800">
            تم إرسال رابط الاستعادة
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            تحقق من بريدك الإلكتروني
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            أرسلنا تعليمات تحديث كلمة المرور إلى:
          </p>

          <p
            dir="ltr"
            className="mt-2 break-all text-sm font-bold text-slate-900"
          >
            {email}
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:bg-emerald-900"
        >
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div>
        <p className="text-sm font-bold text-emerald-700">
          استعادة الحساب
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-950">
          نسيت كلمة المرور؟
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا آمنًا
          لتحديث كلمة المرور.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            البريد الإلكتروني
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            dir="ltr"
          />
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
            ? "جارٍ إرسال الرابط..."
            : "إرسال رابط الاستعادة"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-7 block text-center text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        العودة إلى تسجيل الدخول
      </Link>
    </div>
  );
}

