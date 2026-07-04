"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentCompanyId } from "@/lib/companySession";

type Company = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

export default function CommandCenterPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCommandCenter() {
      const companyId = getCurrentCompanyId();

      if (!companyId) {
        setMessage("لم يتم العثور على بيانات الشركة. يرجى الرجوع إلى صفحة Assessment.");
        setLoading(false);
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .select("id, name, industry, country, employee_count")
        .eq("id", companyId)
        .single();

      if (companyError) {
        setMessage("حدث خطأ أثناء تحميل بيانات الشركة: " + companyError.message);
        setLoading(false);
        return;
      }

      const { data: answersData, error: answersError } = await supabase
        .from("discovery_answers")
        .select("id, question, answer, question_order")
        .eq("company_id", companyId)
        .order("question_order", { ascending: true });

      if (answersError) {
        setMessage("حدث خطأ أثناء تحميل إجابات الاستكشاف: " + answersError.message);
        setLoading(false);
        return;
      }

      setCompany(companyData);
      setAnswers(answersData || []);
      setLoading(false);
    }

    loadCommandCenter();
  }, []);

  const kpis = [
    { label: "الشركة الحالية", value: company?.name || "-", note: "Active workspace" },
    { label: "الوكلاء النشطون", value: "6", note: "Digital workforce online" },
    { label: "إجابات Discovery", value: `${answers.length}`, note: "Executive inputs" },
    { label: "معدل التشغيل", value: "99%", note: "System health" },
  ];

  const workforce = [
    {
      name: "Employee Experience Manager",
      title: "مدير تجربة الموظف الذكي",
      desc: "يعالج طلبات الموظفين اليومية مثل الإجازات والخطابات والاستفسارات.",
      status: "Online",
      load: "74%",
      priority: "High",
    },
    {
      name: "Documents & Policies Advisor",
      title: "مسؤول الوثائق والسياسات الذكي",
      desc: "يجيب من السياسات والوثائق ويجهز النماذج والخطابات.",
      status: "Online",
      load: "82%",
      priority: "Critical",
    },
    {
      name: "Executive HR Advisor",
      title: "المستشار التنفيذي للموارد البشرية",
      desc: "ينتج الملخصات والتوصيات التنفيذية للإدارة.",
      status: "Online",
      load: "69%",
      priority: "High",
    },
    {
      name: "Talent Acquisition Advisor",
      title: "مستشار المواهب الذكي",
      desc: "يفرز المرشحين ويدعم التوظيف وتحضير قوائم المقابلات.",
      status: "Standby",
      load: "42%",
      priority: company?.employee_count && company.employee_count > 100 ? "High" : "Medium",
    },
    {
      name: "Compliance Intelligence Advisor",
      title: "مسؤول الامتثال الذكي",
      desc: "يراقب الالتزام بالسياسات والمتطلبات التنظيمية.",
      status: "Processing",
      load: "58%",
      priority: "Medium",
    },
    {
      name: "Localization Intelligence Advisor",
      title: "مسؤول التوطين الذكي",
      desc: "يتابع مؤشرات التوطين والتنبيهات المرتبطة بها.",
      status: "Monitoring",
      load: company?.country === "Saudi Arabia" ? "62%" : "40%",
      priority: company?.country === "Saudi Arabia" ? "High" : "Medium",
    },
  ];

  const activities = [
    {
      title: "Company data loaded",
      desc: `تم تحميل بيانات ${company?.name || "الشركة"} وربطها بمركز القيادة.`,
      time: "الآن",
    },
    {
      title: "Discovery signals analyzed",
      desc: `تم تحليل ${answers.length} إجابات من جلسة الاستكشاف.`,
      time: "قبل دقيقة",
    },
    {
      title: "Digital workforce mapped",
      desc: "تم ربط الوكلاء الرقميين المقترحين مع Corporate DNA وCorporate Brain.",
      time: "قبل 3 دقائق",
    },
    {
      title: "Executive priorities prepared",
      desc: "تم تجهيز أولويات تشغيل المرحلة الأولى للإدارة.",
      time: "قبل 5 دقائق",
    },
  ];

  const alerts = [
    {
      title: "Knowledge sources required",
      level: "High",
      desc: "يجب رفع السياسات والإجراءات الداخلية لزيادة دقة Corporate Brain.",
    },
    {
      title: "Discovery data available",
      level: "Medium",
      desc: "تم العثور على إجابات Discovery ويمكن استخدامها في التوصيات.",
    },
    {
      title: "Agent deployment not live yet",
      level: "Medium",
      desc: "الوكلاء حالياً في وضع توصية وتشغيل تجريبي وليس تنفيذ فعلي.",
    },
  ];

  const recommendations = [
    "ابدأ بتفعيل Employee Experience Manager كأول وكيل تشغيلي.",
    "اربط Documents & Policies Advisor مع مصادر المعرفة الداخلية.",
    "اجعل Executive HR Advisor يرسل ملخصاً أسبوعياً للإدارة.",
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 shadow-xl">
          <p className="font-bold text-emerald-300">
            AI Workforce Command Center
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            مركز قيادة القوى العاملة الرقمية
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
            من هنا تراقب الإدارة حالة الوكلاء، المهام، التنبيهات، والأنشطة
            التنفيذية المرتبطة بالشركة الحالية وبيانات Discovery.
          </p>
        </section>

        {loading && (
          <section className="mt-10 rounded-3xl border border-slate-700 bg-white p-10 text-center text-slate-900 shadow-xl">
            <p className="text-xl font-bold">جاري تحميل Command Center...</p>
          </section>
        )}

        {!loading && message && (
          <section className="mt-10 rounded-3xl border border-amber-300 bg-amber-50 p-10 text-center text-amber-900 shadow-xl">
            <p className="text-xl font-bold">{message}</p>

            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white"
            >
              العودة إلى Assessment
            </Link>
          </section>
        )}

        {!loading && !message && (
          <>
            <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-slate-700 bg-white p-6 text-slate-900 shadow-xl"
                >
                  <p className="font-semibold text-slate-500">{item.label}</p>

                  <h2 className="mt-3 text-4xl font-black">
                    {item.value}
                  </h2>

                  <p className="mt-3 text-sm font-bold text-emerald-700">
                    {item.note}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl lg:col-span-2">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-3xl font-bold">
                      Digital Workforce Status
                    </h3>

                    <p className="mt-2 text-slate-600">
                      حالة تشغيل الوكلاء المقترحين لـ {company?.name || "الشركة"}.
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700">
                    6 Agents Monitored
                  </span>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {workforce.map((agent) => (
                    <div key={agent.name} className="rounded-3xl bg-slate-100 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xl font-bold">{agent.title}</h4>

                          <p className="mt-1 text-sm font-bold text-emerald-700">
                            {agent.name}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700">
                          {agent.status}
                        </span>
                      </div>

                      <p className="mt-4 leading-7 text-slate-600">
                        {agent.desc}
                      </p>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
                          <span>Current Load</span>
                          <span>{agent.load}</span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: agent.load }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-white p-4 text-sm font-bold text-slate-700">
                        Priority: {agent.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  Executive Alerts
                </h3>

                <div className="mt-6 space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.title}
                      className="rounded-2xl bg-amber-50 p-5 text-amber-950"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-bold">{alert.title}</h4>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">
                          {alert.level}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-7">{alert.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  Live Activity
                </h3>

                <div className="mt-6 space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.title} className="rounded-2xl bg-slate-100 p-5">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <h4 className="font-bold">{activity.title}</h4>

                        <span className="text-sm font-bold text-emerald-700">
                          {activity.time}
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-slate-600">
                        {activity.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
                <h3 className="text-3xl font-bold">
                  KAFU Recommendations
                </h3>

                <p className="mt-4 text-lg leading-9 text-slate-600">
                  بناءً على بيانات {company?.name || "الشركة"} وحالة الوكلاء الحالية،
                  يقترح كفو هذه الأولويات للتنفيذ خلال المرحلة الأولى.
                </p>

                <div className="mt-6 space-y-4">
                  {recommendations.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-4 rounded-2xl bg-emerald-50 p-5 text-emerald-950"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                        {index + 1}
                      </div>

                      <p className="font-bold leading-7">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-12 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-10 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold">
                  الخطوة التالية: Executive Dashboard
                </h3>

                <p className="mt-4 max-w-3xl text-lg leading-9 text-slate-300">
                  بعد تشغيل مركز القيادة، ننتقل إلى لوحة الإدارة التنفيذية التي
                  تلخص القيمة، الأداء، التوصيات، وخارطة الطريق.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="rounded-2xl bg-emerald-600 px-8 py-5 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                Open Executive Dashboard
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}