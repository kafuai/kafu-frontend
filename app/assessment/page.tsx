"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  saveCurrentCompanyId,
  getCurrentCompanyId,
} from "@/lib/companySession";
import { useLocalization } from "@/components/localization/LocalizationContext";

// --- قاموس الترجمة ---
const CONTENT = {
  ar: {
    badge: "Executive Discovery",
    title: "دعنا نبدأ بفهم مؤسستكم",
    description:
      "قبل أن أقترح أي حلول، أحتاج إلى تكوين صورة واضحة عن بيئة العمل، حجم المؤسسة، وأهدافها الحالية. كل معلومة ستساعدني على بناء توصيات أكثر دقة وواقعية.",
    companyInfo: "معلومات المؤسسة",
    placeholders: {
      companyName: "اسم الشركة",
      industry: "القطاع",
      country: "الدولة",
      employeeCount: "عدد الموظفين",
      contactName: "الاسم",
      contactEmail: "البريد الإلكتروني",
      contactPhone: "رقم الجوال",
      contactTitle: "المسمى الوظيفي",
    },
    contactInfo: "مسؤول التواصل",
    whyAsk: {
      title: "لماذا أسأل هذه الأسئلة؟",
      description:
        "لأن كفو لا يقدم حلولاً جاهزة للجميع. كل مؤسسة لها تحدياتها، ولذلك أبني التوصيات اعتماداً على واقع المؤسسة وليس على افتراضات عامة.",
    },
    buttons: {
      saving: "جاري حفظ البيانات...",
      submit: "متابعة جلسة الاستكشاف",
    },
    messages: {
      saveError: "حدث خطأ أثناء الحفظ: ",
      noUser: "تم حفظ بيانات الشركة، لكن تعذر تحديد المستخدم الحالي.",
      noOrg: "تم حفظ بيانات الشركة، لكن تعذر تحديد المنظمة المرتبطة بها.",
      assessmentError: "تم حفظ بيانات الشركة، لكن تعذر تسجيل اكتمال Assessment: ",
      success: "✅ تم حفظ بيانات الشركة بنجاح. سيتم نقلك إلى جلسة الاستكشاف...",
    },
  },
  en: {
    badge: "Executive Discovery",
    title: "Let's start by understanding your organization",
    description:
      "Before proposing any solutions, I need a clear picture of your work environment, organization size, and current goals. Every piece of information helps me build more accurate and realistic recommendations.",
    companyInfo: "Organization Information",
    placeholders: {
      companyName: "Company Name",
      industry: "Industry",
      country: "Country",
      employeeCount: "Number of Employees",
      contactName: "Name",
      contactEmail: "Email Address",
      contactPhone: "Phone Number",
      contactTitle: "Job Title",
    },
    contactInfo: "Contact Person",
    whyAsk: {
      title: "Why do I ask these questions?",
      description:
        "Because KAFU does not offer one-size-fits-all solutions. Every organization has its own challenges, which is why recommendations are built based on your reality, not general assumptions.",
    },
    buttons: {
      saving: "Saving data...",
      submit: "Continue to Discovery Session",
    },
    messages: {
      saveError: "Error saving: ",
      noUser: "Company data saved, but the current user could not be determined.",
      noOrg: "Company data saved, but the associated organization could not be determined.",
      assessmentError: "Company data saved, but failed to record Assessment completion: ",
      success: "✅ Company data saved successfully. Redirecting to discovery session...",
    },
  },
} as const;

export default function AssessmentPage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTitle, setContactTitle] = useState("");

  useEffect(() => {
    async function loadCompany() {
      const companyId = getCurrentCompanyId();

      if (!companyId) return;

      const { data, error } = await supabase
        .from("companies")
        .select(
          "name, industry, country, employee_count, contact_name, contact_email, contact_phone, contact_title"
        )
        .eq("id", companyId)
        .single();

      if (error || !data) return;

      setCompanyName(data.name ?? "");
      setIndustry(data.industry ?? "");
      setCountry(data.country ?? "");
      setEmployeeCount(
        data.employee_count !== null && data.employee_count !== undefined
          ? String(data.employee_count)
          : ""
      );
      setContactName(data.contact_name ?? "");
      setContactEmail(data.contact_email ?? "");
      setContactPhone(data.contact_phone ?? "");
      setContactTitle(data.contact_title ?? "");
    }

    loadCompany();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const companyId = getCurrentCompanyId();

    let data;
    let error;

    const companyData = {
      name: companyName,
      industry,
      country,
      employee_count: employeeCount ? Number(employeeCount) : null,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      contact_title: contactTitle,
      status: "active",
    };

    if (companyId) {
      const result = await supabase
        .from("companies")
        .update(companyData)
        .eq("id", companyId)
        .select("id")
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("companies")
        .insert(companyData)
        .select("id")
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      setLoading(false);
      setMessage(t.messages.saveError + error.message);
      return;
    }

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      setLoading(false);
      setMessage(t.messages.noUser);
      return;
    }

    const {
      data: membership,
      error: membershipError,
    } = await supabase
      .from("organization_memberships")
      .select(`
        organization_id,
        organizations!inner (
          id,
          company_id
        )
      `)
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (membershipError || !membership?.organization_id) {
      setLoading(false);
      setMessage(t.messages.noOrg);
      return;
    }

    const { error: assessmentCompletionError } = await supabase
      .from("organizations")
      .update({
        assessment_completed: true,
      })
      .eq("id", membership.organization_id);

    if (assessmentCompletionError) {
      setLoading(false);
      setMessage(t.messages.assessmentError + assessmentCompletionError.message);
      return;
    }

    if (data?.id) {
      saveCurrentCompanyId(data.id);
    }

    setMessage(t.messages.success);

    setTimeout(() => {
      router.push("/discovery");
    }, 1000);
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white text-start"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">{t.badge}</p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            {t.title}
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">
            {t.description}
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-10 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl"
        >
          <div>
            <h2 className="text-3xl font-bold">{t.companyInfo}</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t.placeholders.companyName}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t.placeholders.industry}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t.placeholders.country}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />

              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                type="number"
                placeholder={t.placeholders.employeeCount}
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">{t.contactInfo}</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t.placeholders.contactName}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />

              <input
                className={`rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isArabic ? "text-right" : "text-left"}`}
                type="email"
                dir="ltr"
                placeholder={t.placeholders.contactEmail}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />

              <input
                className={`rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isArabic ? "text-right" : "text-left"}`}
                dir="ltr"
                type="tel"
                placeholder={t.placeholders.contactPhone}
                value={contactPhone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9+]/g, "");
                  setContactPhone(onlyNumbers);
                }}
                required
              />

              <input
                className="rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={t.placeholders.contactTitle}
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="text-xl font-bold">{t.whyAsk.title}</h3>
            <p className="mt-3 leading-8 text-slate-600">
              {t.whyAsk.description}
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl bg-emerald-600 py-5 text-xl font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t.buttons.saving : t.buttons.submit}
          </button>

          {message && (
            <p className={`text-center font-bold ${message.includes("✅") ? "text-emerald-700" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}