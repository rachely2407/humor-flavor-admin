import { assertAdminByAccessToken } from "@/lib/auth";
import {
  getAdminResourceConfig,
  normalizeAdminValue,
} from "@/lib/adminResources";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    return Response.json({ error: "Unknown resource." }, { status: 404 });
  }

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from(config.table)
    .select("*")
    .order(config.orderBy, { ascending: config.orderAscending ?? false })
    .limit(200);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ rows: data ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const user = await assertAdminByAccessToken(request.headers.get("authorization"));
    const { resource } = await params;
    const config = getAdminResourceConfig(resource);

    if (!config || config.mode !== "crud") {
      return Response.json({ error: "Unknown resource." }, { status: 404 });
    }

    const body = await request.json();
    const now = new Date().toISOString();
    const payload: Record<string, string | number | boolean | null> = {};

    for (const field of config.editableFields) {
      payload[field] = normalizeAdminValue(body[field], config.fieldTypes[field]);
    }

    payload.created_by_user_id = user.id;
    payload.modified_by_user_id = user.id;
    payload.created_datetime_utc = now;
    payload.modified_datetime_utc = now;

    const admin = supabaseAdmin();
    const { error } = await admin.from(config.table).insert(payload);

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
