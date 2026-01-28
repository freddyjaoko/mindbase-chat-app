"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { generateDailyBriefing } from "@/lib/ai/insights-service";
import { LLMModel } from "@/lib/llm/types";
import db from "@/lib/server/db";
import { profiles } from "@/lib/server/db/schema";
import { authOrRedirect } from "@/lib/server/utils";

export async function generateBriefingAction(slug: string) {
  const { profile, tenant } = await authOrRedirect(slug);

  await generateDailyBriefing(profile.id, tenant.id);

  revalidatePath(`/o/${slug}/insights`);
}

export async function updateInsightModelAction(slug: string, model: string) {
  const { profile } = await authOrRedirect(slug);

  await db
    .update(profiles)
    .set({ insightModel: model as LLMModel })
    .where(eq(profiles.id, profile.id));

  revalidatePath(`/o/${slug}/insights`);
}
