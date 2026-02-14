import { NextRequest } from "next/server";

import { generateDocument, listDocuments } from "@/lib/ai/document-service";
import { createDocumentRequestSchema, documentListResponseSchema, documentSchema } from "@/lib/api";
import { getRawContext } from "@/lib/server/conversation-context/utils";
import { requireAuthContextFromRequest } from "@/lib/server/utils";

export async function GET(request: NextRequest) {
    const { tenant } = await requireAuthContextFromRequest(request);
    const docs = await listDocuments(tenant.id);
    return Response.json(documentListResponseSchema.parse(docs));
}

export async function POST(request: NextRequest) {
    const { profile, tenant } = await requireAuthContextFromRequest(request);
    const json = await request.json();
    const { title, type, prompt } = createDocumentRequestSchema.parse(json);

    const contextText = await getRawContext(tenant, prompt);

    const doc = await generateDocument({
        profileId: profile.id,
        tenantId: tenant.id,
        title,
        type,
        prompt,
        contextText,
    });

    return Response.json(documentSchema.parse(doc));
}
