import AuthenticationShell from "../../components/authentication/AuthenticationShell";
import ResetPasswordForm from "../../components/authentication/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthenticationShell
      eyebrow="SECURE PASSWORD UPDATE"
      title="أنشئ كلمة مرور جديدة لحسابك"
      description="حدّث بيانات الدخول واستعد الوصول الآمن إلى مساحة عمل KAFU AI المؤسسية."
    >
      <ResetPasswordForm />
    </AuthenticationShell>
  );
}
