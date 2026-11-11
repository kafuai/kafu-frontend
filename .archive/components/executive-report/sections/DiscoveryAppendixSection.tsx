import ExecutiveCard from "../ExecutiveCard";
import ExecutiveHeader from "../ExecutiveHeader";

type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

type Props = {
  answers: DiscoveryAnswer[];
  opportunities: string[];
};

export default function DiscoveryAppendixSection({
  answers,
  opportunities,
}: Props) {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
      <ExecutiveCard className="lg:col-span-1">
        <div className="flex flex-col gap-8 border-b border-slate-200 pb-8 lg:flex-row lg:items-start lg:justify-between">
          <ExecutiveHeader
            eyebrow="Discovery Appendix"
            title="إجابات جلسة الاستكشاف"
            description="مرجع تنفيذي شامل للبيانات التي اعتمد عليها KAFU AI أثناء بناء التقرير والتحليلات."
          />

          <div className="shrink-0 rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-7 py-5 text-center shadow-sm">
            <p className="text-5xl font-black text-slate-950">
              {answers.length}
            </p>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.30em] text-slate-500">
              Answers
            </p>
          </div>
        </div>

        <div className="mt-10 max-h-[760px] space-y-6 overflow-y-auto pr-2">
          {answers.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-lg font-black leading-8 text-slate-950">
                {item.question_order}. {item.question}
              </p>

              <div className="my-5 h-px bg-gradient-to-r from-slate-100 via-slate-200 to-transparent" />

              <p className="leading-8 text-slate-700">
                {item.answer || "لم تتم الإجابة على هذا السؤال."}
              </p>
            </article>
          ))}

          {answers.length === 0 && (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              لا توجد إجابات محفوظة لهذه الشركة حتى الآن.
            </div>
          )}
        </div>
      </ExecutiveCard>

      <ExecutiveCard>
        <ExecutiveHeader
          eyebrow="Corporate Signals"
          title="الفرص والقرارات التي يراها KAFU AI"
          description="أبرز الإشارات التنفيذية التي تم استخلاصها لدعم صناع القرار."
        />

        <div className="space-y-6">
          {opportunities.map((item, index) => (
            <article
              key={`${item}-${index}`}
              className="rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">
                Signal {String(index + 1).padStart(2, "0")}
              </p>

              <p className="mt-4 text-lg font-bold leading-8 text-emerald-950">
                {item}
              </p>
            </article>
          ))}
        </div>
      </ExecutiveCard>
    </section>
  );
}