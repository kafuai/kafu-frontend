"use client";

import { useState, useTransition } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");

  function handleUpdate(newStage: string) {
    setErrorMessage("");

    startTransition(async () => {
      try {
        await updateLeadStage(pipelineId, newStage);
        router.refresh();
      } catch (error) {
        console.error("Failed to update lead stage:", error);

        setErrorMessage(
          "تعذر تحديث حالة الفرصة. يرجى المحاولة مرة أخرى.",
        );
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {stages.map((stage) => (
          <button
            key={stage.value}
            type="button"
            disabled={isPending}
            onClick={() => handleUpdate(stage.value)}
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "جارٍ التحديث..." : stage.label}
          </button>
        ))}
      </div>

      {errorMessage && (
        <p
          className="mt-2 max-w-xs text-xs font-semibold leading-5 text-red-700"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}