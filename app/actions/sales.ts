"use server";

import { supabase } from "@/lib/supabase";

export async function updateLeadStage(pipelineId: string, newStage: string) {
  const { error } = await supabase
    .from("sales_pipeline")
    .update({
      status: newStage,
    })
    .eq("id", pipelineId);

  if (error) {
    console.error(error);
    throw new Error("Failed to update lead stage");
  }

  return { success: true };
}