import { assertAdminByAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const user = await assertAdminByAccessToken(
      request.headers.get("authorization")
    );

    const body = await request.json();
    const url = String(body.url ?? "").trim();
    const imageDescription =
      body.image_description === undefined || body.image_description === null
        ? null
        : String(body.image_description).trim() || null;
    const isPublic = Boolean(body.is_public);

    if (!url) {
      return Response.json({ error: "Image URL is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("images")
      .insert({
        url,
        image_description: imageDescription,
        is_public: isPublic,
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