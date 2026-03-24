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
    const imageId = id;

    if (!imageId) {
      return Response.json({ error: "Invalid image id." }, { status: 400 });
    }

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

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("images")
      .update({
        url,
        image_description: imageDescription,
        is_public: isPublic,
        modified_by_user_id: user.id,
        modified_datetime_utc: new Date().toISOString(),
      })
      .eq("id", imageId);

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
    const imageId = id;

    if (!imageId) {
      return Response.json({ error: "Invalid image id." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const { error } = await admin.from("images").delete().eq("id", imageId);

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