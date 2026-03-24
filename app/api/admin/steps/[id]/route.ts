import { assertAdminByAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function detectStepSchema() {
  const admin = supabaseAdmin();

  const { data } = await admin.from("humor_flavor_steps").select("*").limit(1);

  const sample = data?.[0] ?? {};

  const flavorKey =
    "humor_flavor_id" in sample
      ? "humor_flavor_id"
      : "flavor_id" in sample
      ? "flavor_id"
      : "parent_flavor_id" in sample
      ? "parent_flavor_id"
      : "humor_flavor_id";

  const orderKey =
    "order_by" in sample ? "order_by" : "order" in sample ? "order" : "order_by";

  return { flavorKey, orderKey };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await assertAdminByAccessToken(
      request.headers.get("authorization")
    );

    const { id } = await params;
    const stepId = Number(id);

    if (Number.isNaN(stepId)) {
      return Response.json({ error: "Invalid step id." }, { status: 400 });
    }

    const body = await request.json();
    const admin = supabaseAdmin();
    const { flavorKey, orderKey } = await detectStepSchema();

    const payload: Record<string, any> = {
      llm_temperature:
        body.llm_temperature === "" ||
        body.llm_temperature === null ||
        body.llm_temperature === undefined
          ? null
          : Number(body.llm_temperature),
      llm_input_type_id: Number(body.llm_input_type_id),
      llm_output_type_id: Number(body.llm_output_type_id),
      llm_model_id: Number(body.llm_model_id),
      humor_flavor_step_type_id: Number(body.humor_flavor_step_type_id),
      llm_system_prompt: String(body.llm_system_prompt ?? "").trim(),
      llm_user_prompt: String(body.llm_user_prompt ?? "").trim(),
      description:
        body.description === undefined || body.description === null
          ? null
          : String(body.description).trim() || null,
      modified_by_user_id: user.id,
      modified_datetime_utc: new Date().toISOString(),
    };

    payload[flavorKey] = Number(body.humor_flavor_id);
    payload[orderKey] = Number(body.order_by);

    const { error } = await admin
      .from("humor_flavor_steps")
      .update(payload)
      .eq("id", stepId);

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
    const stepId = Number(id);

    if (Number.isNaN(stepId)) {
      return Response.json({ error: "Invalid step id." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const { error } = await admin
      .from("humor_flavor_steps")
      .delete()
      .eq("id", stepId);

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