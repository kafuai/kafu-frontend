"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
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

export default function RegistrationForm() {
  const router = useRouter();

  const [fullName, setFullName] =
    useState("");
  const [companyName, setCompanyName] =
    useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
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

    setIsSubmitting(true);

    try {
      const result =
        await getBrowserAuthenticationService().signUp({
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          email: email.trim(),
          password,
        });

      if (result.requiresEmailConfirmation) {
        router.push(
          `/login?registration=confirmation&email=${encodeURIComponent(
            email.trim(),
          )}`,
        );

        return;
      }

      router.replace("/company-dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر إنشاء الحساب. حاول مجددًا.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div>
        <p className="text-sm font-bold text-emerald-700">
          حساب مؤسسي جديد
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-950">
          ابدأ مساحة عملك
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          أنشئ حسابك للوصول إلى إمكانات KAFU AI المؤسسية.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            الاسم الكامل
          </label>

          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            اسم المؤسسة
          </label>

          <input
            id="companyName"
            type="text"
            autoComplete="organization"
            required
            value={companyName}
            onChange={(event) =>
              setCompanyName(event.target.value)
            }
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            بريد العمل
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
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-left text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            dir="ltr"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            كلمة المرور
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
              className="h-12 w-full rounded-xl border border-slate-200 px-4 pl-12 text-left text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
            ? "جارٍ إنشاء الحساب..."
            : "إنشاء الحساب"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-700 hover:text-emerald-800"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
