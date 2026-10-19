"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveCurrentCompanyId, getCurrentCompanyId } from "@/lib/companySession";
import { useLocalization } from "@/components/localization/LocalizationContext";

import { useAssessmentCopy } from "@/components/assessment/useAssessmentCopy";
import type { AssessmentFormData } from "@/components/assessment/types";

import Header from "@/components/assessment/Header";
import CompanyInfoForm from "@/components/assessment/CompanyInfoForm";
import ContactInfoForm from "@/components/assessment/ContactInfoForm";
import InfoBox from "@/components/assessment/InfoBox";

export default function AssessmentPage() {
  const router = useRouter();
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = useAssessmentCopy(locale);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<AssessmentFormData>({
    companyName: "",
    industry: "",
    country: "",
    employeeCount: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactTitle: "",
  });

  const handleChange = (field: keyof AssessmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    async function loadCompany() {
      const companyId = getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase
        .from("companies")
        .select("name, industry, country, employee_count, contact_name, contact_email, contact_phone, contact_title")
        .eq("id", companyId)
        .single();

      if (error || !data) return;

      setFormData({
        companyName: data.name ?? "",
        industry: data.industry ?? "",
        country: data.country ?? "",
        employeeCount: data.employee_count !== null && data.employee_count !== undefined ? String(data.employee_count) : "",
        contactName: data.contact_name ?? "",
        contactEmail: data.contact_email ?? "",
        contactPhone: data.contact_phone ?? "",
        contactTitle: data.contact_title ?? "",
      });
    }

    loadCompany();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const companyId = getCurrentCompanyId();
    const companyData = {
      name: formData.companyName,
      industry: formData.industry,
      country: formData.country,
      employee_count: formData.employeeCount ? Number(formData.employeeCount) : null,
      contact_name: formData.contactName,
      contact_email: formData.contactEmail,
      contact_phone: formData.contactPhone,
      contact_title: formData.contactTitle,
      status: "active",
    };

    try {
      let data, error;

      if (companyId) {
        const result = await supabase.from("companies").update(companyData).eq("id", companyId).select("id").single();
        data = result.data;
        error = result.error;
      } else {
        const result = await supabase.from("companies").insert(companyData).select("id").single();
        data = result.data;
        error = result.error;
      }

      if (error) throw new Error(t.messages.saveError + error.message);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error(t.messages.noUser);

      const { data: membership, error: membershipError } = await supabase
        .from("organization_memberships")
        .select("organization_id, organizations!inner(id, company_id)")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (membershipError || !membership?.organization_id) throw new Error(t.messages.noOrg);

      const { error: assessmentCompletionError } = await supabase
        .from("organizations")
        .update({ assessment_completed: true })
        .eq("id", membership.organization_id);

      if (assessmentCompletionError) throw new Error(t.messages.assessmentError + assessmentCompletionError.message);

      if (data?.id) saveCurrentCompanyId(data.id);

      setMessage(t.messages.success);
      setTimeout(() => router.push("/discovery"), 1000);

    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white text-start" dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        <Header badge={t.badge} title={t.title} description={t.description} />

        <form onSubmit={handleSubmit} className="mt-10 space-y-10 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl">
          <CompanyInfoForm title={t.companyInfo} placeholders={t.placeholders} data={formData} onChange={handleChange} />
          
          <ContactInfoForm title={t.contactInfo} placeholders={t.placeholders} data={formData} onChange={handleChange} isArabic={isArabic} />

          <InfoBox title={t.whyAsk.title} description={t.whyAsk.description} />

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