import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type ConversationTone = "insight" | "recommendation" | "risk";

type ConversationItem = {
  title: string;
  label: string;
  message: string;
  tone: ConversationTone;
};

type ExecutiveConversationProps = {
  score: number;
  status: string;
  maturityLevel: string;
  aiConfidence: number;
  dataQualityScore: number;
};

const toneStyles: Record<
  ConversationTone,
  {
    badge: string;
    border: string;
    background: string;
    accent: string;
  }
> = {
  insight: {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    border: "border-sky-100",
    background: "from-sky-50/70 via-white to-white",
    accent: "bg-sky-500",
  },
  recommendation: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    border: "border-emerald-100",
    background: "from-emerald-50/70 via-white to-white",
    accent: "bg-emerald-500",
  },
  risk: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    border: "border-amber-100",
    background: "from-amber-50/70 via-white to-white",
    accent: "bg-amber-500",
  },
};

function buildConversation({
  score,
  status,
  maturityLevel,
  aiConfidence,
  dataQualityScore,
}: ExecutiveConversationProps): ConversationItem[] {
  const riskMessage =
    score < 60
      ? "إذا لم يتم رفع نضج العمليات والحوكمة قريبًا، فقد تواجه المؤسسة ضغطًا واضحًا في التنفيذ والتوسع."
      : "النمو الحالي إيجابي، لكن الحفاظ على جودة التنفيذ يتطلب حوكمة تشغيلية أكثر نضجًا.";

  return [
    {
      title: "Executive Insight",
      label: "01",
      message: `تشير قراءة KAFU AI إلى أن المؤسسة تقع حاليًا ضمن مستوى "${maturityLevel}" مع حالة عامة "${status}"، مما يوفر أساسًا جيدًا لاتخاذ قرارات تنفيذية أكثر دقة.`,
      tone: "insight",
    },
    {
      title: "Board Recommendation",
      label: "02",
      message:
        score >= 75
          ? "التوصية الحالية هي تحويل هذا النضج إلى خطة تنفيذية واضحة، وربط مؤشرات الأداء بالقرارات اليومية ومتابعة التنفيذ بصورة مستمرة."
          : "التوصية الحالية هي تقوية الأساس التشغيلي وتحسين الانضباط المؤسسي قبل الدخول في توسعات كبيرة.",
      tone: "recommendation",
    },
    {
      title: "Risk Signal",
      label: "03",
      message: `${riskMessage} وتعتمد هذه القراءة على جودة بيانات بلغت ${dataQualityScore}% وثقة تحليل بالذكاء الاصطناعي وصلت إلى ${aiConfidence}%.`,
      tone: "risk",
    },
  ];
}

export default function ExecutiveConversation(props: ExecutiveConversationProps) {
  const conversationItems = buildConversation(props);

  return (
    <ExecutiveCard className="overflow-hidden p-0">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white lg:p-10">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10">
          <ExecutiveHeader
            eyebrow="Executive Conversation"
            title="ماذا يقول KAFU AI للإدارة التنفيذية؟"
            description="حوار تنفيذي مختصر يلخص الرؤية الحالية، أهم التوصيات، والإشارات التي تستحق اهتمام الإدارة العليا."
            light
            className="mb-0"
          />
        </div>
      </section>

      <section className="p-7 lg:p-9">
        <div className="space-y-5">
          {conversationItems.map((item) => {
            const style = toneStyles[item.tone];

            return (
              <article
                key={item.title}
                className={`group relative overflow-hidden rounded-[2rem] border ${style.border} bg-gradient-to-br ${style.background} p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${style.accent}`}
                />

                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-500 shadow-sm">
                    {item.label}
                  </div>

                  <div>
                    <div
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] ${style.badge}`}
                    >
                      {item.title}
                    </div>

                    <p className="mt-5 text-lg font-medium leading-9 text-slate-700">
                      {item.message}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-8 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Executive Closing Note
          </p>

          <p className="mt-4 text-lg font-bold leading-9 text-slate-200">
            هذا التقرير يمثل نقطة البداية. كلما زادت جودة البيانات واستمر تحديثها،
            أصبحت توصيات KAFU AI أكثر دقة وقابلية للتحويل إلى قرارات تنفيذية قابلة
            للقياس والمتابعة.
          </p>
        </section>
      </section>
    </ExecutiveCard>
  );
}