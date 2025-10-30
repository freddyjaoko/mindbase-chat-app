import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { updateTenantSchema } from "@/lib/api";
import db from "@/lib/server/db";
import * as schema from "@/lib/server/db/schema";
import { requireAdminContextFromRequest } from "@/lib/server/utils";

export async function PATCH(request: NextRequest) {
  const { tenant } = await requireAdminContextFromRequest(request);

  const json = await request.json();
  const update = updateTenantSchema.partial().parse(json);

  try {
    await db.update(schema.tenants).set(update).where(eq(schema.tenants.id, tenant.id));
  } catch (error) {
    console.error("Failed to update tenant:", error);
    return Response.json({ error: "Failed to update tenant settings" }, { status: 500 });
  }

  return new Response();
}
