import CorporateDNACard from "../CorporateDNACard";
import CorporateBrainCard from "../CorporateBrainCard";
import ExecutiveConversation from "../ExecutiveConversation";
import ExecutiveIntelligencePanel from "../ExecutiveIntelligencePanel";

type Props = {
  corporateDNA: Parameters<typeof CorporateDNACard>[0]["dna"];
  corporateBrain: Parameters<typeof CorporateBrainCard>[0]["brain"];
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
            ظ…ظ† ظ‚ط±ط§ط،ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط¥ظ„ظ‰ ظپظ‡ظ… ط·ط±ظٹظ‚ط© ط¹ظ…ظ„ ط§ظ„ظ…ط¤ط³ط³ط©
          </h2>

          <p className="max-w-4xl text-base leading-8 text-slate-600">
            ظٹط¨ط¯ط£ KAFU AI ظپظٹ ظ‡ط°ظ‡ ط§ظ„ظ…ط±ط­ظ„ط© ط¨طھط­ظˆظٹظ„ ظ†طھط§ط¦ط¬ ط¬ظ„ط³ط© Discovery ط¥ظ„ظ‰ ظ‡ظˆظٹط©
            طھط´ط؛ظٹظ„ظٹط© ظˆط¹ظ‚ظ„ ظ…ط¤ط³ط³ظٹ ظٹط³ط§ط¹ط¯ ط§ظ„ط¥ط¯ط§ط±ط© ط¹ظ„ظ‰ ظپظ‡ظ… ط§ظ„ظ‚ط±ط§ط±طŒ ط§ظ„ظ…ط®ط§ط·ط±طŒ ظˆظپط±طµ
            ط§ظ„ظ†ظ…ظˆ ط¨طµظˆط±ط© ظ‚ط§ط¨ظ„ط© ظ„ظ„طھظ†ظپظٹط°.
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