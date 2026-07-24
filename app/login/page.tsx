import {
  Suspense,
} from "react";

import AuthenticationShell from "../../components/authentication/AuthenticationShell";
import LoginForm from "../../components/authentication/LoginForm";

export default function LoginPage() {
  return (
    <AuthenticationShell
      eyebrow="SECURE ACCESS"
      title="بوابتك الآمنة إلى منظومة KAFU AI"
      description="ادخل إلى مساحة العمل الموحدة لإدارة المعرفة المؤسسية والقرارات والاتصالات وفرق العمل الرقمية."
    >
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-slate-500">
            جارٍ تجهيز تسجيل الدخول...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthenticationShell>
  );
}
