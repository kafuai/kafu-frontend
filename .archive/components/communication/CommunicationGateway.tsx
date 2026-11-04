"use client";

import {
  Building2,
  Mail,
  MessageCircleMore,
  Mic,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

import CommunicationChannelCard from "./CommunicationChannelCard";

export default function CommunicationGateway() {
  const { locale } = useLocalization();

  const channels = [
    {
      icon: MessageCircleMore,
      title: "WhatsApp",
      description:
        locale === "ar"
          ? "استقبال استفسارات وطلبات الموظفين والعملاء وتحويلها إلى محادثات مؤسسية قابلة للتتبع."
          : "Receive employee and client requests and convert them into traceable enterprise conversations.",
    },
    {
      icon: Mail,
      title:
        locale === "ar"
          ? "البريد الإلكتروني"
          : "Email",
      description:
        locale === "ar"
          ? "فهم الرسائل والمرفقات وتصنيف الطلبات وإنشاء ردود أو إجراءات مناسبة."
          : "Understand messages and attachments, classify requests, and generate responses or actions.",
    },
    {
      icon: Mic,
      title:
        locale === "ar"
          ? "التسجيل الصوتي"
          : "Voice Recording",
      description:
        locale === "ar"
          ? "تحويل التسجيلات الصوتية إلى نص وسياق وطلب قابل للمعالجة داخل المنصة."
          : "Convert voice recordings into text, context, and actionable enterprise requests.",
    },
    {
      icon: MonitorSmartphone,
      title:
        locale === "ar"
          ? "المحادثة داخل المنصة"
          : "In-Platform Chat",
      description:
        locale === "ar"
          ? "محادثات مباشرة مرتبطة بهوية الموظف والشركة والمعرفة المؤسسية."
          : "Direct conversations connected to employee identity, company context, and enterprise knowledge.",
    },
  ];

  return (
    <section className="rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
            <Building2 size={22} />
          </span>

          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-primary)]">
              {locale === "ar"
                ? "بوابة التواصل المؤسسي"
                : "Enterprise Communication Gateway"}
            </span>

            <h2 className="mt-3 text-2xl font-black text-[var(--text-primary)] md:text-3xl">
              {locale === "ar"
                ? "قناة واحدة للذكاء، مهما اختلفت وسيلة التواصل"
                : "One intelligence layer across every communication channel"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "توحّد البوابة جميع رسائل العميل وموظفيه، ثم تربطها بهوية المستخدم وسياق المؤسسة وCorporate Brain."
                : "The gateway unifies all client and employee messages, then connects them to identity, enterprise context, and Corporate Brain."}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--success-background)] px-4 py-2 text-xs font-black text-[var(--success)]">
          <ShieldCheck size={14} />

          {locale === "ar"
            ? "سياق موحد وآمن"
            : "Unified Secure Context"}
        </span>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {channels.map((channel) => (
          <CommunicationChannelCard
            key={channel.title}
            icon={channel.icon}
            title={channel.title}
            description={channel.description}
          />
        ))}
      </div>
    </section>
  );
}