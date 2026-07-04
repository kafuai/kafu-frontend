import ExecutiveDecisionCenter from "../ExecutiveDecisionCenter";
import ExecutiveIntelligenceDashboard from "../ExecutiveIntelligenceDashboard";

type Props = {
  overallScore: number;
  aiConfidence: number;
  dataQualityScore: number;
  discoveryCompletion: number;
  readinessMatrix: {
    area: string;
    score: number;
    status: string;
    description: string;
  }[];
};

export default function DecisionIntelligenceSection({
  overallScore,
  aiConfidence,
  dataQualityScore,
  discoveryCompletion,
  readinessMatrix,
}: Props) {
  return (
    <section className="rounded-[2.75rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-slate-500">
          Decision Intelligence
        </p>

        <h2 className="max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          تحويل التحليل إلى قرارات تنفيذية قابلة للتنفيذ
        </h2>

        <p className="max-w-4xl text-base leading-8 text-slate-600">
          يجمع هذا القسم أهم مؤشرات الأداء والاستعداد المؤسسي في لوحة تنفيذية
          واحدة، لتسهيل تقييم الوضع الحالي واتخاذ قرارات مبنية على البيانات.
        </p>
      </div>

      <div className="grid gap-10 xl:grid-cols-2">
        <ExecutiveIntelligenceDashboard
          overallScore={overallScore}
          aiConfidence={aiConfidence}
          dataQualityScore={dataQualityScore}
          discoveryCompletion={discoveryCompletion}
          readinessMatrix={readinessMatrix}
        />

        <ExecutiveDecisionCenter
          score={overallScore}
          aiConfidence={aiConfidence}
          dataQualityScore={dataQualityScore}
        />
      </div>
    </section>
  );
}