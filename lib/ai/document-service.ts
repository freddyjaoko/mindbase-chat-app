import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { eq, desc } from "drizzle-orm";

import { LLMModel, getProviderForModel } from "@/lib/llm/types";
import db from "@/lib/server/db";
import { documents, documentVersions, profiles } from "@/lib/server/db/schema";

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
      return openai(model);
  }
}

export async function refineDocument({
  documentId,
  refinementPrompt,
  contextText = "",
}: {
  documentId: string;
  refinementPrompt: string;
  contextText?: string;
}) {
  const doc = await db.query.documents.findFirst({
    where: eq(documents.id, documentId),
  });

  if (!doc) throw new Error("Document not found");

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, doc.profileId),
  });

  const modelId = (profile?.insightModel as LLMModel) || "gpt-4o";

  const systemPrompt = `
    You are an expert document editor.
    You are refining an existing document based on a user's instruction.
    The document type is: ${doc.type}.
    
    Guidelines:
    - Maintain the overall structure unless asked to change it.
    - Ground your changes in any new context provided.
    - Return the FULL updated document in Markdown.
    - Be precise with your edits.
  `;

  const fullPrompt = `
    Current Document Content:
    ---
    ${doc.content}
    ---
    
    User Refinement Instruction: ${refinementPrompt}
    
    Relevant Context:
    ${contextText}
    
    Please provide the complete updated document.
  `;

  const { text } = await generateText({
    model: getLanguageModel(modelId),
    system: systemPrompt,
    prompt: fullPrompt,
  });

  // Update DB
  await db
    .update(documents)
    .set({
      content: text,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, documentId));

  await db.insert(documentVersions).values({
    documentId,
    content: text,
    changeSummary: refinementPrompt.substring(0, 100),
  });

  return { ...doc, content: text };
}

export async function getDocument(documentId: string) {
  return db.query.documents.findFirst({
    where: eq(documents.id, documentId),
    with: {
      versions: {
        orderBy: [desc(documentVersions.createdAt)],
      },
    },
  });
}

export async function listDocuments(tenantId: string) {
  return db.query.documents.findMany({
    where: eq(documents.tenantId, tenantId),
    orderBy: [desc(documents.updatedAt)],
  });
}
