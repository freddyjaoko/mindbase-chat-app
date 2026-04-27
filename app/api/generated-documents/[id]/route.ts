import { NextRequest } from "next/server";

import { getDocument, refineDocument } from "@/lib/ai/document-service";
import { documentSchema, refineDocumentRequestSchema } from "@/lib/api";
import { getRawContext } from "@/lib/server/conversation-context/utils";
import { requireAuthContextFromRequest } from "@/lib/server/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAuthContextFromRequest(request);
  const { id } = await params;
  const doc = await getDocument(id);

  if (!doc) {
    return new Response("Document not found", { status: 404 });
  }

  return Response.json(documentSchema.parse(doc));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { tenant } = await requireAuthContextFromRequest(request);
  const { id } = await params;
  const json = await request.json();
  const { prompt } = refineDocumentRequestSchema.parse(json);
  const contextText = await getRawContext(tenant, prompt);

  const doc = await refineDocument({
    documentId: id,
    refinementPrompt: prompt,
    contextText,
  });

  return Response.json(documentSchema.parse(doc));
}
