"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStage } from "@/app/actions/sales";

type LeadStageButtonsProps = {
  pipelineId: string;
};

const stages = [
  { label: "Contacted", className: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "Meeting", className: "bg-teal-600 hover:bg-teal-700" },
  { label: "Proposal", className: "bg-cyan-600 hover:bg-cyan-700" },
  { label: "Won", className: "bg-green-700 hover:bg-green-800" },
];

export default function LeadStageButtons({ pipelineId }: LeadStageButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleUpdate(newStage: string) {
    startTransition(async () => {
      await updateLeadStage(pipelineId, newStage);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((stage) => (
        <button
          key={stage.label}
          disabled={isPending}
          onClick={() => handleUpdate(stage.label)}
          className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition disabled:opacity-50 ${stage.className}`}
        >
          {isPending ? "Updating..." : stage.label}
        </button>
      ))}
    </div>
  );
}