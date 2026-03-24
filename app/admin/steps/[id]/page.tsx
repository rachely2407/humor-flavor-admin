import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { StepEditor } from "@/components/step-editor";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getFlavorRefKey, getOrderKey } from "@/lib/stepSchema";

export default async function AdminStepDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMatrixOrSuperadmin();

  const { id } = await params;
  const stepId = Number(id);

  if (Number.isNaN(stepId)) {
    notFound();
  }

  const admin = supabaseAdmin();
  const { data: sampleRows, error: sampleError } = await admin
    .from("humor_flavor_steps")
    .select("*")
    .limit(1);

  if (sampleError) {
    throw new Error(sampleError.message);
  }

  const sample = sampleRows?.[0] ?? {};
  const flavorKey = getFlavorRefKey(sample);
  const orderKey = getOrderKey(sample);

  const [
    { data: step, error: stepError },
    { data: flavors, error: flavorsError },
    { data: stepTypes, error: stepTypesError },
    { data: models, error: modelsError },
    { data: inputTypes, error: inputTypesError },
    { data: outputTypes, error: outputTypesError },
  ] = await Promise.all([
    admin
      .from("humor_flavor_steps")
      .select(
        `
          id,
          ${flavorKey},
          ${orderKey},
          llm_temperature,
          llm_input_type_id,
          llm_output_type_id,
          llm_model_id,
          humor_flavor_step_type_id,
          llm_system_prompt,
          llm_user_prompt,
          description
        `
      )
      .eq("id", stepId)
      .single(),
    admin.from("humor_flavors").select("id, slug").order("id", { ascending: true }),
    admin
      .from("humor_flavor_step_types")
      .select("id")
      .order("id", { ascending: true }),
    admin.from("llm_models").select("id").order("id", { ascending: true }),
    admin.from("llm_input_types").select("id").order("id", { ascending: true }),
    admin.from("llm_output_types").select("id").order("id", { ascending: true }),
  ]);

  if (stepError) {
    notFound();
  }

  if (flavorsError) throw new Error(flavorsError.message);
  if (stepTypesError) throw new Error(stepTypesError.message);
  if (modelsError) throw new Error(modelsError.message);
  if (inputTypesError) throw new Error(inputTypesError.message);
  if (outputTypesError) throw new Error(outputTypesError.message);

  return (
    <AdminShell
      title={`Edit Step #${step.id}`}
      current="steps"
      description="Update or delete an individual humor flavor step in a cleaner professional editor."
    >
      <section className="pretty-panel">
        <div className="toolbar">
          <div>
            <h2 className="section-title">Step editor</h2>
            <p className="section-subtitle">
              Modify the step configuration, prompts, ordering fields, and related model settings.
            </p>
          </div>

          <div className="badge">Step ID {step.id}</div>
        </div>

        <StepEditor
          step={step}
          flavors={flavors ?? []}
          stepTypes={stepTypes ?? []}
          models={models ?? []}
          inputTypes={inputTypes ?? []}
          outputTypes={outputTypes ?? []}
        />
      </section>
    </AdminShell>
  );
}
