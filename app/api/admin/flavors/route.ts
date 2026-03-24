import { assertAdminByAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const user = await assertAdminByAccessToken(
      request.headers.get("authorization")
    );

    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const description =
      body.description === undefined || body.description === null
        ? null
        : String(body.description).trim() || null;

    if (!slug) {
      return Response.json({ error: "Slug is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("humor_flavors")
      .insert({
        slug,
        description,
        created_by_user_id: user.id,
        modified_by_user_id: user.id,
        created_datetime_utc: now,
        modified_datetime_utc: now,
      })
      .select("id")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, id: data.id });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 401 }
    );
  }
}