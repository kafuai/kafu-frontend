import AuthenticationShell from "../../components/authentication/AuthenticationShell";
import RegistrationForm from "../../components/authentication/RegistrationForm";

export default function RegisterPage() {
  return (
    <AuthenticationShell
      eyebrow="ENTERPRISE ONBOARDING"
      title="أسّس مساحة عمل مؤسستك على KAFU AI"
      description="أنشئ حسابًا مؤسسيًا موحدًا يمهّد لإدارة المستخدمين والمعرفة والتواصل والعمليات ضمن بيئة آمنة وقابلة للتوسع."
    >
      <RegistrationForm />
    </AuthenticationShell>
  );
}
