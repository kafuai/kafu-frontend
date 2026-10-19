import ExecutiveCard from "./ExecutiveCard";
import ExecutiveHeader from "./ExecutiveHeader";

type CrossAnalysisItem = {
  title: string;
  message: string;
  severity: "success" | "info" | "warning";
};

type CrossAnalysisPanelProps = {
  items: CrossAnalysisItem[];
};

const severityStyles: Record<
  CrossAnalysisItem["severity"],
  {
    badge: string;
    border: string;
    background: string;
  }
> = {
  success: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    border: "border-emerald-100",
    background: "from-emerald-50/70 to-white",
  },
  info: {
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    border: "border-sky-100",
    background: "from-sky-50/70 to-white",
  },
  warning: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    border: "border-amber-100",
    background: "from-amber-50/70 to-white",
  },
};

export default function CrossAnalysisPanel({
  items,
}: CrossAnalysisPanelProps) {
  if (!items || items.length === 0) return null;

  return (
    <ExecutiveCard>
      <ExecutiveHeader
        eyebrow="Cross Analysis"
        title="التحليل التنفيذي المتقاطع"
        description="يربط KAFU AI بين مؤشرات الجاهزية، جودة البيانات، الثقة، واكتمال Discovery لاستخراج استنتاجات تنفيذية أعمق."
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {items.map((item, index) => {
          const style = severityStyles[item.severity];

          return (
            <div
              key={`${item.title}-${index}`}
              className={`rounded-[1.75rem] border ${style.border} bg-gradient-to-br ${style.background} p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${style.badge}`}
                >
                  {item.severity}
                </span>

                <span className="text-xs font-black text-slate-400">
                  Insight 0{index + 1}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                {item.title}
              </h3>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                {item.message}
              </p>
            </div>
          );
        })}
      </div>
    </ExecutiveCard>
  );
}