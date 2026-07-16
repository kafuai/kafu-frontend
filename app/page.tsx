"use client";
import CommunicationFlow from "@/components/communication/CommunicationFlow";
import CommunicationGateway from "@/components/communication/CommunicationGateway";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Command,
  Dna,
  MessageCircleMore,
  Mic,
  Mail,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import ExecutiveDemoFlow from "@/components/demo-flow/ExecutiveDemoFlow";
import { useLocalization } from "@/components/localization/LocalizationContext";

export default function HomePage() {
  const { locale } = useLocalization();
  const DirectionIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  const capabilities = [
    {
      icon: Dna,
      title:
        locale === "ar"
          ? "فهم هوية المؤسسة"
          : "Understand the Organization",
      description:
        locale === "ar"
          ? "يبني Corporate DNA صورة واضحة عن الهوية والتحديات ونموذج التشغيل."
          : "Corporate DNA creates a clear view of identity, challenges, and the operating model.",
    },
    {
      icon: BrainCircuit,
      title:
        locale === "ar"
          ? "تحويل المعرفة إلى قرارات"
          : "Turn Knowledge into Decisions",
      description:
        locale === "ar"
          ? "يوحّد Corporate Brain المعرفة والبيانات ويحوّلها إلى توصيات تنفيذية."
          : "Corporate Brain unifies knowledge and data into executive recommendations.",
    },
    {
      icon: UsersRound,
      title:
        locale === "ar"
          ? "تشغيل قوى عاملة رقمية"
          : "Activate a Digital Workforce",
      description:
        locale === "ar"
          ? "يوصي بوكلاء رقميين متخصصين لتنفيذ المهام ودعم الموظفين والإدارة."
          : "Deploy specialized digital agents to support employees, management, and execution.",
    },
    {
      icon: Command,
      title:
        locale === "ar"
          ? "إدارة التنفيذ من مركز واحد"
          : "Command Execution Centrally",
      description:
        locale === "ar"
          ? "يراقب AI Command Center الوكلاء والتنبيهات والقرارات والأنشطة."
          : "AI Command Center monitors agents, alerts, decisions, and enterprise activity.",
    },
  ];

  const communicationChannels = [
    {
      icon: MessageCircleMore,
      title: "WhatsApp",
      description:
        locale === "ar"
          ? "استقبال طلبات الموظفين والعملاء عبر واتساب."
          : "Receive employee and client requests through WhatsApp.",
    },
    {
      icon: Mail,
      title:
        locale === "ar"
          ? "البريد الإلكتروني"
          : "Email",
      description:
        locale === "ar"
          ? "فهم الرسائل والرد عليها وتحويلها إلى إجراءات."
          : "Understand messages, respond, and convert them into actions.",
    },
    {
      icon: Mic,
      title:
        locale === "ar"
          ? "التواصل الصوتي"
          : "Voice",
      description:
        locale === "ar"
          ? "إرسال تسجيل صوتي أو التحدث مباشرة داخل المنصة."
          : "Send voice recordings or speak directly inside the platform.",
    },
    {
      icon: Building2,
      title:
        locale === "ar"
          ? "داخل المنصة"
          : "In-Platform",
      description:
        locale === "ar"
          ? "محادثات مؤسسية موحدة مرتبطة بسياق الشركة."
          : "Unified enterprise conversations connected to company context.",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[var(--background)] text-[var(--text-primary)]">
      <section className="px-5 py-10 md:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1580px] items-center gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
              <Sparkles size={15} />
              {locale === "ar"
                ? "نظام التشغيل المؤسسي المدعوم بالذكاء الاصطناعي"
                : "Enterprise AI Operating System"}
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-6xl md:leading-[1.1]">
              {locale === "ar"
                ? "افهم مؤسستك، اتخذ القرار، وشغّل التنفيذ من منصة واحدة"
                : "Understand your enterprise, make decisions, and execute from one platform"}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-xl md:leading-9">
              {locale === "ar"
                ? "تجمع KAFU AI بين Corporate DNA وCorporate Brain والقوى العاملة الرقمية ومركز القيادة لتحويل بيانات المؤسسة ومعرفتها إلى قرارات وتنفيذ قابل للقياس."
                : "KAFU AI connects Corporate DNA, Corporate Brain, Digital Workforce, and AI Command Center to transform enterprise knowledge into measurable decisions and execution."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/welcome"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-7 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
              >
                {locale === "ar"
                  ? "ابدأ التجربة التنفيذية"
                  : "Start Executive Experience"}

                <DirectionIcon size={17} />
              </Link>

              <Link
                href="/corporate-brain"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-7 text-sm font-black text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
              >
                {locale === "ar"
                  ? "استعرض المنصة"
                  : "Explore Platform"}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                locale === "ar"
                  ? "ثنائية اللغة"
                  : "Bilingual",
                "Light / Dark",
                locale === "ar"
                  ? "معرفة مؤسسية"
                  : "Enterprise Knowledge",
                locale === "ar"
                  ? "قرارات قابلة للتتبع"
                  : "Traceable Decisions",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)]"
                >
                  <CheckCircle2
                    size={14}
                    className="text-[var(--success)]"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-large)] md:p-7">
            <div className="rounded-[26px] bg-[var(--text-primary)] p-6 text-[var(--surface)] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <BrainCircuit size={24} />
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[10px] font-black">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {locale === "ar"
                    ? "متصل بالمؤسسة"
                    : "Enterprise Connected"}
                </span>
              </div>

              <h2 className="mt-7 text-2xl font-black md:text-3xl">
                {locale === "ar"
                  ? "مرحبًا، أنا KAFU AI"
                  : "Hello, I’m KAFU AI"}
              </h2>

              <p className="mt-4 text-sm leading-8 opacity-75">
                {locale === "ar"
                  ? "لن أبدأ بحل جاهز. سأفهم مؤسستك أولًا، ثم أبني معرفتها، وأحدد أولوياتها، وأقترح فريقها الرقمي وخطة التنفيذ."
                  : "I do not begin with a generic solution. I first understand your enterprise, build its knowledge, identify priorities, and recommend its digital workforce and execution plan."}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                locale === "ar"
                  ? "ما أكبر تحدٍ تشغيلي يستهلك وقت فريقك؟"
                  : "What operational challenge consumes the most team time?",
                locale === "ar"
                  ? "ما القرارات التي تتأخر بسبب نقص البيانات أو المعرفة؟"
                  : "Which decisions are delayed by missing data or knowledge?",
                locale === "ar"
                  ? "ما أول نتيجة تريد تحقيقها خلال 90 يومًا؟"
                  : "What outcome should be achieved in the next 90 days?",
              ].map((question, index) => (
                <div
                  key={question}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-xs font-black text-[var(--brand-primary)]">
                    {index + 1}
                  </span>

                  <p className="text-sm font-bold leading-6 text-[var(--text-secondary)]">
                    {question}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--success-background)] p-4">
              <div className="flex items-center gap-3 text-[var(--success)]">
                <ShieldCheck size={18} />

                <span className="text-xs font-black">
                  {locale === "ar"
                    ? "النتيجة: فهم مؤسسي قابل للتحويل إلى قرار وتنفيذ"
                    : "Outcome: Enterprise understanding converted into decisions and execution"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 md:px-8 lg:px-10">
  <div className="mx-auto max-w-[1580px] space-y-6">
    <ExecutiveDemoFlow />

    <CommunicationGateway />

    <CommunicationFlow />
  </div>
</section>

      <section className="px-5 py-12 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1580px]">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-primary)]">
              {locale === "ar"
                ? "قدرات المنصة"
                : "Platform Capabilities"}
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
              {locale === "ar"
                ? "من فهم المؤسسة إلى تشغيلها بذكاء"
                : "From enterprise understanding to intelligent execution"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              {locale === "ar"
                ? "كل طبقة داخل KAFU AI تكمل الطبقة السابقة، لتكوين نظام تشغيل مؤسسي مترابط."
                : "Each KAFU AI layer builds on the previous one to create a connected enterprise operating system."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article
                  key={capability.title}
                  className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[var(--shadow-small)] transition hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                    <Icon size={22} />
                  </span>

                  <h3 className="mt-5 text-lg font-black text-[var(--text-primary)]">
                    {capability.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {capability.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1580px] rounded-[32px] border border-[var(--border-default)] bg-[var(--surface)] p-7 shadow-[var(--shadow-small)] md:p-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-subtle)] px-4 py-2 text-xs font-black text-[var(--brand-primary)]">
                <MessageCircleMore size={15} />
                {locale === "ar"
                  ? "تواصل متعدد القنوات"
                  : "Omnichannel Communication"}
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-4xl">
                {locale === "ar"
                  ? "تواصل مع KAFU AI من القناة التي تناسبك"
                  : "Communicate with KAFU AI through the channel that fits your work"}
              </h2>

              <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
                {locale === "ar"
                  ? "يستطيع العميل وموظفوه التواصل مع KAFU AI عبر واتساب أو البريد الإلكتروني أو التسجيل الصوتي أو المحادثة داخل المنصة، مع بقاء السياق والهوية والمعرفة موحدة."
                  : "Clients and employees can communicate through WhatsApp, email, voice, or in-platform chat while identity, context, and enterprise knowledge remain unified."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {communicationChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <article
                    key={channel.title}
                    className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-5"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--brand-primary)] shadow-[var(--shadow-small)]">
                      <Icon size={18} />
                    </span>

                    <h3 className="mt-4 text-sm font-black text-[var(--text-primary)]">
                      {channel.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                      {channel.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 pt-8 md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1580px] flex-col items-start justify-between gap-6 rounded-[32px] bg-[var(--text-primary)] p-8 text-[var(--surface)] md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-black md:text-3xl">
              {locale === "ar"
                ? "ابدأ بفهم مؤسستك، وليس بشراء أداة جديدة"
                : "Start by understanding your enterprise, not by buying another tool"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-75">
              {locale === "ar"
                ? "ابدأ الجلسة التنفيذية ودع KAFU AI يحول المعرفة والتحديات إلى خطة واضحة وقرارات قابلة للتنفيذ."
                : "Start the executive session and let KAFU AI convert knowledge and challenges into a clear, actionable plan."}
            </p>
          </div>

          <Link
            href="/welcome"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--surface)] px-6 text-sm font-black text-[var(--text-primary)]"
          >
            {locale === "ar"
              ? "ابدأ الآن"
              : "Start Now"}

            <DirectionIcon size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}