import AuthenticationShell from "../../components/authentication/AuthenticationShell";
import ForgotPasswordForm from "../../components/authentication/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthenticationShell
      eyebrow="ACCOUNT RECOVERY"
      title="استعد الوصول إلى حسابك بأمان"
      description="تدفق استعادة آمن ومتكامل مع Supabase Authentication لحماية حسابات المستخدمين وبيانات المؤسسة."
    >
      <ForgotPasswordForm />
    </AuthenticationShell>
  );
}
