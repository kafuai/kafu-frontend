"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateLeadStage } from "@/app/actions/sales";

type LeadStageButtonsProps = {
  pipelineId: string;
};

const stages = [
  {
    value: "Contacted",
    label: "تم التواصل",
  },
  {
    value: "Meeting",
    label: "اجتماع",
  },
  {
    value: "Proposal",
    label: "عرض",
  },
  {
    value: "Won",
    label: "مكتملة",
  },
];

export default function LeadStageButtons({
  pipelineId,
}: LeadStageButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleUpdate(newStage: string) {
    startTransition(async () => {
      await updateLeadStage(pipelineId, newStage);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {stages.map((stage) => (
        <button
          key={stage.value}
          type="button"
          disabled={isPending}
          onClick={() => handleUpdate(stage.value)}
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "جارٍ التحديث..." : stage.label}
        </button>
      ))}
    </div>
  );
}
