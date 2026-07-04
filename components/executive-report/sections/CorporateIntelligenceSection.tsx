import CorporateDNACard from "../CorporateDNACard";
import CorporateBrainCard from "../CorporateBrainCard";
import ExecutiveConversation from "../ExecutiveConversation";
import ExecutiveIntelligencePanel from "../ExecutiveIntelligencePanel";

type Props = {
  corporateDNA: any;
  corporateBrain: any;
  score: number;
  status: string;
  maturityLevel: string;
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

export default function CorporateIntelligenceSection({
  corporateDNA,
  corporateBrain,
  score,
  status,
  maturityLevel,
  aiConfidence,
  dataQualityScore,
  discoveryCompletion,
  readinessMatrix,
}: Props) {
  return (
    <div className="space-y-12">
      <section className="rounded-[2.75rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="mb-10 flex flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-700">
            Corporate Intelligence Layer
          </p>

          <h2 className="max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            من قراءة البيانات إلى فهم طريقة عمل المؤسسة
          </h2>

          <p className="max-w-4xl text-base leading-8 text-slate-600">
            يبدأ KAFU AI في هذه المرحلة بتحويل نتائج جلسة Discovery إلى هوية
            تشغيلية وعقل مؤسسي يساعد الإدارة على فهم القرار، المخاطر، وفرص
            النمو بصورة قابلة للتنفيذ.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <ExecutiveIntelligencePanel
            aiConfidence={aiConfidence}
            dataQualityScore={dataQualityScore}
            discoveryCompletion={discoveryCompletion}
            readinessMatrix={readinessMatrix}
          />

          <CorporateDNACard dna={corporateDNA} />
        </div>
      </section>

      <section className="grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
        <CorporateBrainCard brain={corporateBrain} />

        <ExecutiveConversation
          score={score}
          status={status}
          maturityLevel={maturityLevel}
          aiConfidence={aiConfidence}
          dataQualityScore={dataQualityScore}
        />
      </section>
    </div>
  );
}