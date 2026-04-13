import { assertAdminByAccessToken } from "@/lib/auth";
import { getFlavorRefKey } from "@/lib/stepSchema";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function buildUniqueSlug(baseSlug: string, existingSlugs: string[]) {
  const trimmedBase = baseSlug.trim() || "flavor";
  const normalizedExisting = new Set(existingSlugs.map((slug) => slug.toLowerCase()));

  let attempt = `${trimmedBase} copy`;
  let counter = 2;

  while (normalizedExisting.has(attempt.toLowerCase())) {
    attempt = `${trimmedBase} copy ${counter}`;
    counter += 1;
  }

  return attempt;
}

export async function POST(
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

    const now = new Date().toISOString();
    const admin = supabaseAdmin();

    const [
      { data: sourceFlavor, error: flavorError },
      { data: allFlavors, error: allFlavorsError },
      { data: allSteps, error: stepsError },
    ] = await Promise.all([
      admin.from("humor_flavors").select("*").eq("id", flavorId).single(),
      admin.from("humor_flavors").select("slug"),
      admin.from("humor_flavor_steps").select("*"),
    ]);

    if (flavorError || !sourceFlavor) {
      return Response.json({ error: flavorError?.message ?? "Flavor not found." }, { status: 400 });
    }

    if (allFlavorsError) {
      return Response.json({ error: allFlavorsError.message }, { status: 400 });
    }

    if (stepsError) {
      return Response.json({ error: stepsError.message }, { status: 400 });
    }

    const newSlug = buildUniqueSlug(
      String(sourceFlavor.slug ?? sourceFlavor.id),
      (allFlavors ?? []).map((flavor) => String(flavor.slug ?? ""))
    );

    const { data: insertedFlavor, error: insertFlavorError } = await admin
      .from("humor_flavors")
      .insert({
        slug: newSlug,
        description: sourceFlavor.description ?? null,
        created_by_user_id: user.id,
        modified_by_user_id: user.id,
        created_datetime_utc: now,
        modified_datetime_utc: now,
      })
      .select("id, slug")
      .single();

    if (insertFlavorError || !insertedFlavor) {
      return Response.json(
        { error: insertFlavorError?.message ?? "Failed to duplicate flavor." },
        { status: 400 }
      );
    }

    const sampleStep = allSteps?.[0] ?? {};
    const flavorKey = getFlavorRefKey(sampleStep);

    const sourceSteps = (allSteps ?? [])
      .filter((step) => Number(step[flavorKey] ?? 0) === flavorId)
      .sort((a, b) => Number(a.id ?? 0) - Number(b.id ?? 0));

    if (sourceSteps.length > 0) {
      const duplicatedSteps = sourceSteps.map((step) => {
        const cloned = { ...step } as Record<string, unknown>;

        delete cloned.id;
        delete cloned.created_datetime_utc;
        delete cloned.modified_datetime_utc;
        delete cloned.created_by_user_id;
        delete cloned.modified_by_user_id;

        cloned[flavorKey] = insertedFlavor.id;
        cloned.created_by_user_id = user.id;
        cloned.modified_by_user_id = user.id;
        cloned.created_datetime_utc = now;
        cloned.modified_datetime_utc = now;

        return cloned;
      });

      const { error: insertStepsError } = await admin
        .from("humor_flavor_steps")
        .insert(duplicatedSteps);

      if (insertStepsError) {
        return Response.json({ error: insertStepsError.message }, { status: 400 });
      }
    }

    return Response.json({
      success: true,
      id: insertedFlavor.id,
      slug: insertedFlavor.slug,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 401 }
    );
  }
}
