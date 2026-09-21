import CrossAnalysisPanel from "../CrossAnalysisPanel";
import KeyFindings from "../KeyFindings";
import NinetyDayRoadmap from "../NinetyDayRoadmap";
import QuickWins from "../QuickWins";
import RiskAssessment from "../RiskAssessment";
import StrategicPriorities from "../StrategicPriorities";

type Finding = {
  title: string;
  description: string;
  impact: string;
};

type Priority = {
  title: string;
  description: string;
  timeline: string;
};

type Risk = {
  title: string;
  description: string;
  level: string;
};

type QuickWin = {
  title: string;
  description: string;
  effort: string;
};

type RoadmapPhase = {
  period: string;
  title: string;
  description: string;
  outcome: string;
};

type CrossAnalysisItem = {
  title: string;
  message: string;
  severity: "success" | "info" | "warning";
};

type Props = {
  findings: Finding[];
  priorities: Priority[];
  risks: Risk[];
  quickWins: QuickWin[];
  crossAnalysis: CrossAnalysisItem[];
  roadmap: RoadmapPhase[];
};

export default function StrategicInsightsSection({
  findings,
  priorities,
  risks,
  quickWins,
  crossAnalysis,
  roadmap,
}: Props) {
  return (
    <>
      <section>
        <div className="mb-7 flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">
            Strategic Findings
          </p>

          <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            ماذا يجب أن يرى مجلس الإدارة؟
          </h2>
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <KeyFindings findings={findings} />
          <StrategicPriorities priorities={priorities} />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <RiskAssessment risks={risks} />
        <QuickWins wins={quickWins} />
      </section>

      <section>
        <CrossAnalysisPanel items={crossAnalysis} />
      </section>

      <section>
        <NinetyDayRoadmap phases={roadmap} />
      </section>
    </>
  );
}