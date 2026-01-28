import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { eq, desc } from "drizzle-orm";

import { LLMModel, getProviderForModel } from "@/lib/llm/types";
import db from "@/lib/server/db";
import { dailyBriefings, profiles, messages, conversations } from "@/lib/server/db/schema";

function getLanguageModel(model: string) {
  const provider = getProviderForModel(model);
  switch (provider) {
    case "openai":
      return openai(model);
    case "google":
      return google(model);
    case "anthropic":
      return anthropic(model);
    case "groq":
      return groq(model);
    default:
      return openai(model); // Attempt fallback or error
  }
}

export async function generateDailyBriefing(profileId: string, tenantId: string) {
  // Get user profile to check preferred model
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  });

  if (!profile) throw new Error("Profile not found");

  const modelId = (profile.insightModel as LLMModel) || "gpt-4o";

  // Fetch recent messages (last 24 hours) from this user
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Use drizzle query builder to get conversations and messages
  const recentConversations = await db.query.conversations.findMany({
    where: (conversations, { eq, and, gt }) =>
      and(eq(conversations.profileId, profileId), gt(conversations.updatedAt, oneDayAgo)),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
      },
    },
  });

  const allMessagesText = recentConversations
    .flatMap((c) => c.messages.filter((m) => m.content).map((m) => `${m.role}: ${m.content}`))
    .join("\n\n");

  if (!allMessagesText) {
    return null; // No activity to summarize
  }

  const prompt = `
    You are an AI assistant tasked with creating a "Daily Briefing" for the user based on their chat history from the last 24 hours.
    Here is the chat transcript:
    
    ${allMessagesText}
    
    Please provide a concise summary of the key topics discussed, any outstanding action items, and clear insights derived from their interactions.
    Format the output in Markdown.
    Focus on being helpful and strictly factual based on the context.
  `;

  const { text } = await generateText({
    model: getLanguageModel(modelId),
    prompt: prompt,
  });

  // Save to DB
  await db.insert(dailyBriefings).values({
    profileId,
    tenantId,
    content: text,
    model: modelId,
  });

  return text;
}

export async function getLatestBriefing(profileId: string) {
  const briefing = await db.query.dailyBriefings.findFirst({
    where: eq(dailyBriefings.profileId, profileId),
    orderBy: [desc(dailyBriefings.createdAt)],
  });

  if (briefing) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Only return if updated today, or maybe allow seeing last one?
    // Requirement "runs every day and gives a morning briefing".
    // Let's return it if it exists, the UI can show the date.
    return briefing;
  }

  return null;
}
