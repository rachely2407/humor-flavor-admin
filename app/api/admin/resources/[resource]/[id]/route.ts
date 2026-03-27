import { assertAdminByAccessToken } from "@/lib/auth";
import {
  getAdminResourceConfig,
  normalizeAdminValue,
  parseAdminId,
} from "@/lib/adminResources";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    const user = await assertAdminByAccessToken(request.headers.get("authorization"));
    const { resource, id } = await params;
    const config = getAdminResourceConfig(resource);

    if (!config || config.mode !== "crud") {
      return Response.json({ error: "Unknown resource." }, { status: 404 });
    }

    const body = await request.json();
    const payload: Record<string, string | number | boolean | null> = {};

    for (const field of config.editableFields) {
      payload[field] = normalizeAdminValue(body[field], config.fieldTypes[field]);
    }

    payload.modified_by_user_id = user.id;
    payload.modified_datetime_utc = new Date().toISOString();

    const admin = supabaseAdmin();
    const { error } = await admin
      .from(config.table)
      .update(payload)
      .eq("id", parseAdminId(id, config.idType));

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 401 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  try {
    await assertAdminByAccessToken(request.headers.get("authorization"));
    const { resource, id } = await params;
    const config = getAdminResourceConfig(resource);

    if (!config || config.mode !== "crud") {
      return Response.json({ error: "Unknown resource." }, { status: 404 });
    }

    const admin = supabaseAdmin();
    const { error } = await admin
      .from(config.table)
      .delete()
      .eq("id", parseAdminId(id, config.idType));

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 401 }
    );
  }
}
