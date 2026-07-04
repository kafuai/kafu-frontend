"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { saveCurrentCompanyId } from "@/lib/companySession";

export default function AssessmentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [employeeCount, setEmployeeCount] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTitle, setContactTitle] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        industry,
        country,
        employee_count: employeeCount ? Number(employeeCount) : null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        contact_title: contactTitle,
        status: "active",
      })
      .select("id")
      .single();

    if (error) {
      setLoading(false);
      setMessage("حدث خطأ أثناء الحفظ: " + error.message);
      return;
    }

    if (data?.id) {
      saveCurrentCompanyId(data.id);
    }

    setMessage("✅ تم حفظ بيانات الشركة بنجاح. سيتم نقلك إلى جلسة الاستكشاف...");

    setTimeout(() => {
      router.push("/discovery");
    }, 1000);
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">Executive Discovery</p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            دعنا نبدأ بفهم مؤسستكم
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">
            قبل أن أقترح أي حلول، أحتاج إلى تكوين صورة واضحة عن بيئة العمل،
            حجم المؤسسة، وأهدافها الحالية. كل معلومة ستساعدني على بناء توصيات
            أكثر دقة وواقعية.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-10 rounded-3xl border border-slate-700 bg-white p-10 text-slate-900 shadow-xl"
        >
          <div>
            <h2 className="text-3xl font-bold">معلومات المؤسسة</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="اسم الشركة"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border p-4"
                placeholder="القطاع"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <input
                className="rounded-xl border p-4"
                placeholder="الدولة"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <input
                className="rounded-xl border p-4"
                type="number"
                placeholder="عدد الموظفين"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">مسؤول التواصل</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-xl border p-4"
                placeholder="الاسم"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />

              <input
                className="rounded-xl border p-4"
                type="email"
                placeholder="البريد الإلكتروني"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />

              <input
                className="rounded-xl border p-4"
                placeholder="رقم الجوال"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />

              <input
                className="rounded-xl border p-4"
                placeholder="المسمى الوظيفي"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-6">
            <h3 className="text-xl font-bold">لماذا أسأل هذه الأسئلة؟</h3>

            <p className="mt-3 leading-8 text-slate-600">
              لأن كفو لا يقدم حلولاً جاهزة للجميع. كل مؤسسة لها تحدياتها،
              ولذلك أبني التوصيات اعتماداً على واقع المؤسسة وليس على افتراضات
              عامة.
            </p>
          </div>

          <button
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl bg-emerald-600 py-5 text-xl font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "جاري حفظ البيانات..." : "متابعة جلسة الاستكشاف"}
          </button>

          {message && (
            <p className="text-center font-bold text-emerald-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}