"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Loader2,
  Search,
  UserCircle,
  KeyRound,
  Save,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/components/localization/LocalizationContext";

type Profile = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type EmployeeData = {
  id: string;
  employee_number: string | null;
  status: string | null;
  job_title: string | null;
  department: string | null;
  nationality: string | null;
  hire_date: string | null;
  contract_type: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  basic_salary: number | null;
  housing_allowance: number | null;
  other_allowances: number | null;
  deductions: number | null;
  phone: string | null;
  national_id: string | null;
  date_of_birth: string | null;
  bank_name: string | null;
  iban: string | null;
};

type EditableForm = {
  phone: string;
  national_id: string;
  date_of_birth: string;
  bank_name: string;
  iban: string;
};

const CONTENT = {
  ar: {
    loading: {
      title: "جاري تحميل الملف الشخصي",
      subtitle: "يتم الآن جلب بيانات حسابك...",
    },
    error: {
      title: "تعذر تحميل الملف الشخصي",
      noSession: "لم يتم العثور على جلسة مستخدم نشطة. يرجى تسجيل الدخول.",
      unknown: "حدث خطأ غير معروف",
      defaultFallback: "لم يتم العثور على بيانات المستخدم الحالي.",
    },
    profile: {
      badge: "الملف الشخصي",
      defaultName: "مستخدم KAFU",
      defaultEmail: "لا يوجد بريد إلكتروني",
      sectionTitle: "البيانات الوظيفية والعقد",
      sectionSubtitle: "بيانات حسابك الأساسية وتفاصيل عقدك (للعرض فقط).",
      financialTitle: "البيانات المالية",
      financialSubtitle: "تفاصيل الراتب والبدلات (للعرض فقط).",
      fullNameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      employeeNumberLabel: "الرقم الوظيفي",
      statusLabel: "الحالة",
      jobTitleLabel: "المسمى الوظيفي",
      departmentLabel: "القسم",
      nationalityLabel: "الجنسية",
      hireDateLabel: "تاريخ التوظيف",
      contractTypeLabel: "نوع العقد",
      contractStartLabel: "بداية العقد",
      contractEndLabel: "نهاية العقد",
      basicSalaryLabel: "الراتب الأساسي",
      housingLabel: "بدل السكن",
      otherAllowancesLabel: "بدلات أخرى",
      deductionsLabel: "الخصومات",
      editableTitle: "البيانات الشخصية والبنكية",
      editableSubtitle: "يمكنك تحديث بياناتك الشخصية والبنكية من هنا.",
      phoneLabel: "رقم الهاتف",
      nationalIdLabel: "رقم الهوية",
      dobLabel: "تاريخ الميلاد",
      bankNameLabel: "اسم البنك",
      ibanLabel: "رقم الآيبان (IBAN)",
      changePassword: "تغيير كلمة المرور",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      saveSuccess: "تم تحديث بياناتك بنجاح!",
      saveError: "حدث خطأ أثناء حفظ البيانات.",
      none: "—",
      currency: "ر.س",
      active: "نشط",
      inactive: "غير نشط",
    },
    executive: {
      badge: "أدوات تنفيذية",
      title: "أدوات الإدارة التنفيذية",
      subtitle: "الوصول السريع إلى مراحل إعداد المؤسسة واستكشافها.",
      assessment: {
        title: "التقييم",
        desc: "مراجعة وتحديث بيانات المؤسسة الأساسية ومرحلة التقييم.",
      },
      discovery: {
        title: "الاستكشاف",
        desc: "الانتقال إلى جلسة الاستكشاف ومراجعة إجابات المؤسسة.",
      },
    },
  },
  en: {
    loading: {
      title: "Loading Profile",
      subtitle: "Fetching your account data...",
    },
    error: {
      title: "Failed to load profile",
      noSession: "No active user session found. Please log in.",
      unknown: "An unknown error occurred",
      defaultFallback: "Current user data not found.",
    },
    profile: {
      badge: "Profile",
      defaultName: "KAFU User",
      defaultEmail: "No email provided",
      sectionTitle: "Employment & Contract Details",
      sectionSubtitle: "Your basic account and contract details (read-only).",
      financialTitle: "Financial Details",
      financialSubtitle: "Salary and allowances (read-only).",
      fullNameLabel: "Full Name",
      emailLabel: "Email Address",
      employeeNumberLabel: "Employee Number",
      statusLabel: "Status",
      jobTitleLabel: "Job Title",
      departmentLabel: "Department",
      nationalityLabel: "Nationality",
      hireDateLabel: "Hire Date",
      contractTypeLabel: "Contract Type",
      contractStartLabel: "Contract Start",
      contractEndLabel: "Contract End",
      basicSalaryLabel: "Basic Salary",
      housingLabel: "Housing Allowance",
      otherAllowancesLabel: "Other Allowances",
      deductionsLabel: "Deductions",
      editableTitle: "Personal & Bank Details",
      editableSubtitle: "You can update your personal and banking information here.",
      phoneLabel: "Phone Number",
      nationalIdLabel: "National ID",
      dobLabel: "Date of Birth",
      bankNameLabel: "Bank Name",
      ibanLabel: "IBAN",
      changePassword: "Change Password",
      saveChanges: "Save Changes",
      saving: "Saving...",
      saveSuccess: "Your data has been updated successfully!",
      saveError: "An error occurred while saving.",
      none: "—",
      currency: "SAR",
      active: "Active",
      inactive: "Inactive",
    },
    executive: {
      badge: "EXECUTIVE TOOLS",
      title: "Executive Management Tools",
      subtitle: "Quick access to enterprise setup and discovery phases.",
      assessment: {
        title: "Assessment",
        desc: "Review and update foundational enterprise data and assessment phase.",
      },
      discovery: {
        title: "Discovery",
        desc: "Proceed to the discovery session and review enterprise inputs.",
      },
    },
  },
} as const;

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [form, setForm] = useState<EditableForm>({
    phone: "",
    national_id: "",
    date_of_birth: "",
    bank_name: "",
    iban: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw new Error(sessionError.message);
        if (!session || !session.user) throw new Error(t.error.noSession);

        const user = session.user;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) throw new Error(profileError.message);

        const { data: empData, error: empError } = await supabase
          .from("payroll_employees")
          .select(`
            id, employee_number, status, job_title, department, nationality, hire_date, 
            contract_type, contract_start_date, contract_end_date, 
            basic_salary, housing_allowance, other_allowances, deductions, 
            phone, national_id, date_of_birth, bank_name, iban
          `)
          .eq("user_id", user.id)
          .maybeSingle();

        if (empError) console.error("Employee Data Error:", empError.message);

        const { data: membershipData, error: membershipError } = await supabase
          .from("organization_memberships")
          .select("role")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membershipError) console.error("Membership Error:", membershipError.message);

        if (isMounted) {
          setProfile(profileData);
          setUserRole(membershipData?.role || null);
          
          if (empData) {
            setEmployeeData(empData as EmployeeData);
            setForm({
              phone: empData.phone || "",
              national_id: empData.national_id || "",
              date_of_birth: empData.date_of_birth || "",
              bank_name: empData.bank_name || "",
              iban: empData.iban || "",
            });
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t.error.unknown;
        console.error("Profile Error:", message);
        if (isMounted) setErrorMessage(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [t.error]);

  const handleFieldChange = (field: keyof EditableForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveMessage({ type: "", text: "" }); 
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!employeeData?.id) return;

    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const { error } = await supabase
        .from("payroll_employees")
        .update({
          phone: form.phone || null,
          national_id: form.national_id || null,
          date_of_birth: form.date_of_birth || null,
          bank_name: form.bank_name || null,
          iban: form.iban || null,
        })
        .eq("id", employeeData.id);

      if (error) throw error;

      setSaveMessage({ type: "success", text: t.profile.saveSuccess });
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveMessage({ type: "error", text: t.profile.saveError });
    } finally {
      setIsSaving(false);
    }
  };

  const formatMoney = (val: number | null) => {
    if (val === null || val === undefined) return t.profile.none;
    return `${val.toLocaleString(isArabic ? "ar-SA" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t.profile.currency}`;
  };

  const inputClass = "w-full rounded-2xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3.5 text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)]";
  const readOnlyClass = "w-full cursor-not-allowed rounded-2xl border border-[var(--border-default)] bg-[var(--background)] px-4 py-3.5 text-[var(--text-primary)] outline-none opacity-70";

  if (loading) {
    return (
      <main dir={isArabic ? "rtl" : "ltr"} className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8 text-[var(--text-primary)]">
        <section className="w-full max-w-md rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] px-8 py-10 text-center shadow-[var(--shadow-small)]">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Loader2 className="animate-spin" size={23} />
          </span>
          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">{t.loading.title}</h1>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{t.loading.subtitle}</p>
        </section>
      </main>
    );
  }

  if (errorMessage || !profile) {
    return (
      <main dir={isArabic ? "rtl" : "ltr"} className="flex min-h-[calc(100vh-76px)] items-center justify-center bg-[var(--background)] px-5 py-10 md:px-8 text-[var(--text-primary)]">
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-8 shadow-[var(--shadow-small)] text-center">
            <h1 className="text-3xl font-black">{t.error.title}</h1>
            <p className="mt-3 text-[var(--text-secondary)]">{errorMessage || t.error.defaultFallback}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--text-primary)] sm:px-8 lg:px-10 text-start">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header Section */}
        <section className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="relative overflow-hidden bg-[var(--surface)] px-6 py-10 sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_38%)]" />
            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--surface)] bg-[var(--background)] shadow-lg">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || "User"} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-20 w-20 text-[var(--text-secondary)]" />
                )}
              </div>
              <div className="text-center sm:text-start">
                <p className="text-sm font-black text-[var(--brand-primary)] uppercase tracking-wider">{t.profile.badge}</p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">{profile.full_name || t.profile.defaultName}</h1>
                <p className="mt-2 text-[var(--text-secondary)]">{profile.email || t.profile.defaultEmail}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Read-Only Section 1: Employment & Contract */}
        <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-6 sm:p-10 shadow-[var(--shadow-small)]">
          <div className="mb-8">
            <h2 className="text-2xl font-black">{t.profile.sectionTitle}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t.profile.sectionSubtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.fullNameLabel}</label>
              <input type="text" value={profile.full_name || ""} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.emailLabel}</label>
              <input type="email" value={profile.email || ""} readOnly dir="ltr" className={`${readOnlyClass} ${isArabic ? "text-right" : "text-left"}`} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.employeeNumberLabel}</label>
              <input type="text" value={employeeData?.employee_number || t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.jobTitleLabel}</label>
              <input type="text" value={employeeData?.job_title || t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.departmentLabel}</label>
              <input type="text" value={employeeData?.department || t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.statusLabel}</label>
              <input type="text" value={employeeData?.status === "active" ? t.profile.active : employeeData?.status === "inactive" ? t.profile.inactive : t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.nationalityLabel}</label>
              <input type="text" value={employeeData?.nationality || t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.contractTypeLabel}</label>
              <input type="text" value={employeeData?.contract_type || t.profile.none} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.hireDateLabel}</label>
              <input type="text" value={employeeData?.hire_date || t.profile.none} readOnly className={readOnlyClass} dir="ltr" style={{ textAlign: isArabic ? "right" : "left" }} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.contractStartLabel}</label>
              <input type="text" value={employeeData?.contract_start_date || t.profile.none} readOnly className={readOnlyClass} dir="ltr" style={{ textAlign: isArabic ? "right" : "left" }} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold">{t.profile.contractEndLabel}</label>
              <input type="text" value={employeeData?.contract_end_date || t.profile.none} readOnly className={readOnlyClass} dir="ltr" style={{ textAlign: isArabic ? "right" : "left" }} />
            </div>
          </div>
        </section>

        {/* Read-Only Section 2: Financial Details */}
        {employeeData && (
          <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-6 sm:p-10 shadow-[var(--shadow-small)]">
            <div className="mb-8">
              <h2 className="text-2xl font-black">{t.profile.financialTitle}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{t.profile.financialSubtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.basicSalaryLabel}</label>
                <input type="text" value={formatMoney(employeeData.basic_salary)} readOnly className={readOnlyClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.housingLabel}</label>
                <input type="text" value={formatMoney(employeeData.housing_allowance)} readOnly className={readOnlyClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.otherAllowancesLabel}</label>
                <input type="text" value={formatMoney(employeeData.other_allowances)} readOnly className={readOnlyClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">{t.profile.deductionsLabel}</label>
                <input type="text" value={formatMoney(employeeData.deductions)} readOnly className={readOnlyClass} />
              </div>
            </div>
          </section>
        )}

        {/* Editable Section: Personal & Bank Details */}
        {employeeData && (
          <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <form onSubmit={handleSaveChanges} className="p-6 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black">{t.profile.editableTitle}</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{t.profile.editableSubtitle}</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">{t.profile.phoneLabel}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className={`${inputClass} ${isArabic ? "text-right" : "text-left"}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">{t.profile.nationalIdLabel}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.national_id}
                    onChange={(e) => handleFieldChange("national_id", e.target.value)}
                    className={`${inputClass} ${isArabic ? "text-right" : "text-left"}`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">{t.profile.dobLabel}</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => handleFieldChange("date_of_birth", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">{t.profile.bankNameLabel}</label>
                  <input
                    type="text"
                    value={form.bank_name}
                    onChange={(e) => handleFieldChange("bank_name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">{t.profile.ibanLabel}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.iban}
                    onChange={(e) => handleFieldChange("iban", e.target.value)}
                    className={`${inputClass} font-mono ${isArabic ? "text-right" : "text-left"}`}
                    placeholder="SA0000000000000000000000"
                  />
                </div>
              </div>

              {saveMessage.text && (
                <div className={`mt-6 flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
                  saveMessage.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {saveMessage.type === "success" && <CheckCircle2 size={18} />}
                  {saveMessage.text}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSaving ? t.profile.saving : t.profile.saveChanges}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Change Password Section */}
        <section className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-2 shadow-[var(--shadow-small)]">
          <Link
            href="/profile/change-password"
            className="group flex items-center justify-between gap-4 rounded-2xl bg-[var(--background)] px-6 py-5 transition hover:bg-[var(--surface-hover)]"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle,rgba(37,99,235,0.08))] text-[var(--brand-primary)]">
                <KeyRound size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="font-bold text-[var(--text-primary)]">{t.profile.changePassword}</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {isArabic ? "حدّث كلمة مرورك للحفاظ على أمان حسابك" : "Update your password to keep your account secure"}
                </p>
              </div>
            </div>
            {isArabic ? (
              <ArrowLeft size={18} className="shrink-0 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={18} className="shrink-0 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />
            )}
          </Link>
        </section>

        {/* Executive Tools Section */}
        {userRole === "owner" && (
          <section className="mt-8">
            <div className="mb-5">
              <p className="text-sm font-black text-[var(--brand-primary)] uppercase tracking-wider">{t.executive.badge}</p>
              <h2 className="mt-2 text-3xl font-black">{t.executive.title}</h2>
              <p className="mt-2 text-[var(--text-secondary)]">{t.executive.subtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/assessment" className="group block rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-7 text-start shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--brand-primary)]">
                    <ClipboardCheck className="h-7 w-7" />
                  </div>
                  {isArabic ? <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />}
                </div>
                <h3 className="mt-6 text-xl font-black">{t.executive.assessment.title}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{t.executive.assessment.desc}</p>
              </Link>
              <Link href="/discovery" className="group block rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-7 text-start shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--brand-primary)]">
                    <Search className="h-7 w-7" />
                  </div>
                  {isArabic ? <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:-translate-x-1" /> : <ArrowRight className="h-5 w-5 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />}
                </div>
                <h3 className="mt-6 text-xl font-black">{t.executive.discovery.title}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{t.executive.discovery.desc}</p>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}