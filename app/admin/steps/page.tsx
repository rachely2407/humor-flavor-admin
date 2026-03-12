import { AdminShell } from "@/components/admin-shell";
import { StepCreator } from "@/components/step-creator";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

async function moveStep(stepId: number, flavorId: number, direction: "up" | "down") {
  "use server";

  const admin = supabaseAdmin();

  const { data: steps } = await admin
    .from("humor_flavor_steps")
    .select("id, order_by")
    .eq("humor_flavor_id", flavorId)
    .order("order_by", { ascending: true });

  if (!steps) return;

  const index = steps.findIndex((s) => s.id === stepId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= steps.length) return;

  const current = steps[index];
  const swap = steps[swapIndex];

  await admin
    .from("humor_flavor_steps")
    .update({ order_by: swap.order_by })
    .eq("id", current.id);

  await admin
    .from("humor_flavor_steps")
    .update({ order_by: current.order_by })
    .eq("id", swap.id);

  revalidatePath("/admin/steps");
}

export default async function AdminStepsPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const [
    { data: steps, error: stepsError },
    { data: flavors, error: flavorsError },
    { data: stepTypes, error: stepTypesError },
    { data: models, error: modelsError },
    { data: inputTypes, error: inputTypesError },
    { data: outputTypes, error: outputTypesError },
  ] = await Promise.all([
    admin
      .from("humor_flavor_steps")
      .select(
        "id, humor_flavor_id, order_by, llm_temperature, llm_model_id, humor_flavor_step_type_id, description"
      )
      .order("humor_flavor_id", { ascending: true })
      .order("order_by", { ascending: true }),
    admin.from("humor_flavors").select("id, slug"),
    admin.from("humor_flavor_step_types").select("id"),
    admin.from("llm_models").select("id"),
    admin.from("llm_input_types").select("id"),
    admin.from("llm_output_types").select("id"),
  ]);

  if (stepsError) throw new Error(stepsError.message);
  if (flavorsError) throw new Error(flavorsError.message);
  if (stepTypesError) throw new Error(stepTypesError.message);
  if (modelsError) throw new Error(modelsError.message);
  if (inputTypesError) throw new Error(inputTypesError.message);
  if (outputTypesError) throw new Error(outputTypesError.message);

  const flavorMap = new Map((flavors ?? []).map((f) => [f.id, f.slug]));

  return (
    <AdminShell
      title="Flavor Steps"
      current="steps"
      description="Structured view of prompt-chain steps with cleaner grouping, better readability, and a more professional operations layout."
    >
      <section className="pretty-panel">
        <div className="toolbar">
          <div>
            <h2 className="section-title">Step definitions</h2>
            <p className="section-subtitle">
              Review and manage flavor step order, model configuration, and descriptions.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <StepCreator
            flavors={flavors ?? []}
            stepTypes={stepTypes ?? []}
            models={models ?? []}
            inputTypes={inputTypes ?? []}
            outputTypes={outputTypes ?? []}
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th style={{ width: 140 }}>Flavor ID</th>
                <th style={{ width: 180 }}>Flavor</th>
                <th style={{ width: 110 }}>Order</th>
                <th style={{ width: 120 }}>Temp</th>
                <th style={{ width: 120 }}>Model</th>
                <th style={{ width: 120 }}>Step Type</th>
                <th>Description</th>
                <th style={{ width: 150 }}>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {(steps ?? []).map((step) => (
                <tr key={step.id}>
                  <td>{step.id}</td>
                  <td>{step.humor_flavor_id}</td>
                  <td>{flavorMap.get(step.humor_flavor_id) ?? "—"}</td>
                  <td>{step.order_by}</td>
                  <td>{step.llm_temperature ?? "—"}</td>
                  <td>{step.llm_model_id}</td>
                  <td>{step.humor_flavor_step_type_id}</td>
                  <td>{step.description || "—"}</td>
                  <td>
                    <div className="row-actions">
                      <form
                        action={async () => {
                          "use server";
                          await moveStep(step.id, step.humor_flavor_id, "up");
                        }}
                      >
                        <button type="submit" className="btn">
                          ↑
                        </button>
                      </form>

                      <form
                        action={async () => {
                          "use server";
                          await moveStep(step.id, step.humor_flavor_id, "down");
                        }}
                      >
                        <button type="submit" className="btn">
                          ↓
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}