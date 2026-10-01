import ExecutiveHeader from "../ExecutiveHeader";
import ExecutiveScore from "../ExecutiveScore";
import BusinessSnapshot from "../BusinessSnapshot";
import ExecutiveRadarChart from "../charts/ExecutiveRadarChart";
import ExecutiveMaturityChart from "../charts/ExecutiveMaturityChart";

type Props = {
  score: number;
  status: string;
  maturityLevel: string;
  summary: string;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  companyName: string | null;
  industry: string | null;
  country: string | null;
  employeeCount: number | null;
};

export default function ExecutiveOverviewSection({
  score,
  status,
  maturityLevel,
  summary,
  aiConfidence,
  dataQualityScore,
  discoveryCompletion,
  companyName,
  industry,
  country,
  employeeCount,
}: Props) {
  return (
    <section className="rounded-[2.75rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
      <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <ExecutiveHeader
          eyebrow="Executive Overview"
          title="الملخص التنفيذي للجاهزية المؤسسية"
          description="قراءة تنفيذية موحدة تجمع مستوى الجاهزية، بيانات المؤسسة، ومؤشرات النضج في لوحة واحدة مهيأة لاجتماعات الإدارة العليا ومجلس الإدارة."
        />

        <div className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-xs font-black uppercase tracking-[0.30em] text-emerald-700">
          Board Snapshot
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
        <ExecutiveScore
          score={score}
          status={status}
          maturityLevel={maturityLevel}
          summary={summary}
        />

        <BusinessSnapshot
          companyName={companyName}
          industry={industry}
          country={country}
          employeeCount={employeeCount}
        />
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <ExecutiveRadarChart
          title="Executive Readiness Radar"
          subtitle="قياس متوازن لأهم المحاور التي تؤثر على قدرة المؤسسة على التنفيذ واتخاذ القرار."
          items={[
            { label: "Strategy", value: score },
            { label: "Execution", value: aiConfidence },
            { label: "Data Quality", value: dataQualityScore },
            { label: "Discovery", value: discoveryCompletion },
            { label: "Risk Control", value: 72 },
            { label: "Scalability", value: 68 },
          ]}
        />

        <ExecutiveMaturityChart
          title="Operational Maturity View"
          subtitle="عرض تنفيذي لمستوى النضج التشغيلي عبر أهم مجالات القيادة والإدارة."
          items={[
            { label: "Strategy", value: score },
            { label: "Execution", value: aiConfidence },
            { label: "Data", value: dataQualityScore },
            { label: "Discovery", value: discoveryCompletion },
            { label: "Risk", value: 72 },
            { label: "Scale", value: 68 },
          ]}
        />
      </div>
    </section>
  );
}