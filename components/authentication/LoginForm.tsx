"use client";

import {
  FormEvent,
  useState,
} from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  MailCheck,
  RefreshCw,
} from "lucide-react";

import {
  getBrowserAuthenticationService,
} from "../../src/enterprise/authentication/authenticationRuntime";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(
    searchParams.get("email") ?? "",
  );
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [resendMessage, setResendMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isResending, setIsResending] =
    useState(false);

  const registrationRequiresConfirmation =
    searchParams.get("registration") ===
    "confirmation";

  const passwordUpdated =
    searchParams.get("password_updated") ===
    "true";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setResendMessage("");
    setIsSubmitting(true);

    try {
      await getBrowserAuthenticationService().signIn({
        email: email.trim(),
        password,
      });

      const requestedPath =
        searchParams.get("next");

      const destination =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/company-dashboard";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر تسجيل الدخول. تحقق من البيانات وحاول مجددًا.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendConfirmation() {
    const normalizedEmail = email.trim();

    setErrorMessage("");
    setResendMessage("");

    if (!normalizedEmail) {
      setErrorMessage(
        "أدخل بريدك الإلكتروني أولًا لإعادة إرسال رسالة التفعيل.",
      );
      return;
    }

    setIsResending(true);

    try {
      await getBrowserAuthenticationService()
        .resendConfirmationEmail(
          normalizedEmail,
          `${window.location.origin}/auth/callback`,
        );

      setResendMessage(
        "تمت إعادة إرسال رسالة التفعيل. تحقق من صندوق الوارد والبريد غير المرغوب فيه.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر إعادة إرسال رسالة التفعيل. حاول مجددًا.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div>
        <p className="text-sm font-bold text-emerald-700">
          تسجيل الدخول
        </p>

        <h2 className="mt-3 text-3xl font-black text-slate-950">
          مرحبًا بعودتك
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          أدخل بيانات حسابك للوصول إلى مساحة عمل مؤسستك.
        </p>
      </div>

      {registrationRequiresConfirmation ? (
        <div
          role="status"
          className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <div className="flex items-start gap-3">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div className="min-w-0 flex-1">
              <p className="font-black text-emerald-900">
                تم إنشاء الحساب بنجاح
              </p>

              <p className="mt-2 text-sm leading-7 text-emerald-800">
                أرسلنا رسالة تأكيد إلى بريدك الإلكتروني.
                افتح الرسالة واضغط على رابط التفعيل قبل
                تسجيل الدخول.
              </p>

              {email ? (
                <p
                  dir="ltr"
                  className="mt-2 break-all text-sm font-bold text-emerald-950"
                >
                  {email}
                </p>
              ) : null}

              <button
                type="button"
                disabled={isResending}
                onClick={handleResendConfirmation}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isResending ? "animate-spin" : ""
                  }`}
                />

                {isResending
                  ? "جارٍ إعادة الإرسال..."
                  : "إعادة إرسال رسالة التفعيل"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {passwordUpdated ? (
        <div
          role="status"
          className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

          <div>
            <p className="font-black text-emerald-900">
              تم تحديث كلمة المرور
            </p>

            <p className="mt-1 text-sm leading-7 text-emerald-800">
              يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            </p>
          </div>
        </div>
      ) : null}

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
              autoComplete="current-password"
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

          <div className="mt-2">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        {resendMessage ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
          >
            {resendMessage}
          </div>
        ) : null}

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
          disabled={isSubmitting || isResending}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 active:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          {isSubmitting
            ? "جارٍ تسجيل الدخول..."
            : "الدخول إلى KAFU AI"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="font-bold text-emerald-700 hover:text-emerald-800"
        >
          إنشاء حساب مؤسسي
        </Link>
      </p>
    </div>
  );
}
