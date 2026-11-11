import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type ExecutiveNarrativeProps = {
  score: number;
  status: string;
  maturityLevel: string;
  summary: string;
};

export default function ExecutiveNarrative({
  score,
  status,
  maturityLevel,
  summary,
}: ExecutiveNarrativeProps) {
  const direction =
    score >= 75
      ? "الشركة لديها أساس جيد يمكن البناء عليه للانتقال إلى نمو أكثر تنظيمًا وقياسًا."
      : "الأولوية الآن ليست التوسع السريع، بل تثبيت الأساس التشغيلي ورفع وضوح القرار.";

  return (
    <ExecutiveCard>
      <ExecutiveHeader
        eyebrow="Executive Narrative"
        title="القراءة التنفيذية المختصرة"
        description="ملخص تنفيذي سريع يمنح الإدارة العليا رؤية واضحة قبل الدخول في التفاصيل."
      />

      <div className="mt-10 space-y-6">
        <section className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
          <p className="text-xl font-bold leading-[2.2] text-slate-800">
            {summary}
          </p>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-sky-500 h-1" />

          <div className="p-8">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-400">
              Strategic Direction
            </p>

            <p className="mt-6 text-2xl font-black leading-[2] text-white">
              بناءً على نتيجة{" "}
              <span className="text-emerald-300">{score}%</span>
              {" "}وحالة{" "}
              <span className="text-emerald-300">{status}</span>
              {" "}ومستوى{" "}
              <span className="text-emerald-300">{maturityLevel}</span>
              ، فإن اتجاه KAFU AI هو:
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-lg leading-9 text-slate-200">
                {direction}
              </p>
            </div>
          </div>
        </section>
      </div>
    </ExecutiveCard>
  );
}