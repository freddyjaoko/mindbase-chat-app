import { NextRequest } from "next/server";

import { listDocuments } from "@/lib/ai/document-service";
import { documentListResponseSchema } from "@/lib/api";
import { requireAuthContextFromRequest } from "@/lib/server/utils";

export async function GET(request: NextRequest) {
  const { tenant } = await requireAuthContextFromRequest(request);
  const docs = await listDocuments(tenant.id);
  return Response.json(documentListResponseSchema.parse(docs));
}
