import { assertAdminByAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await assertAdminByAccessToken(
      request.headers.get("authorization")
    );

    const { id } = await params;
    const flavorId = Number(id);

    if (Number.isNaN(flavorId)) {
      return Response.json({ error: "Invalid flavor id." }, { status: 400 });
    }

    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const description =
      body.description === undefined || body.description === null
        ? null
        : String(body.description).trim() || null;

    if (!slug) {
      return Response.json({ error: "Slug is required." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("humor_flavors")
      .update({
        slug,
        description,
        modified_by_user_id: user.id,
        modified_datetime_utc: new Date().toISOString(),
      })
      .eq("id", flavorId);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await assertAdminByAccessToken(request.headers.get("authorization"));

    const { id } = await params;
    const flavorId = Number(id);

    if (Number.isNaN(flavorId)) {
      return Response.json({ error: "Invalid flavor id." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("humor_flavors")
      .delete()
      .eq("id", flavorId);

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