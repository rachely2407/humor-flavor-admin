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
    { data: steps },
    { data: flavors },
    { data: stepTypes },
    { data: models },
    { data: inputTypes },
    { data: outputTypes },
  ] = await Promise.all([
    admin
      .from("humor_flavor_steps")
      .select(
        "id, humor_flavor_id, order_by, llm_temperature, llm_model_id, humor_flavor_step_type_id, description"
      )
      .order("humor_flavor_id")
      .order("order_by"),

    admin.from("humor_flavors").select("id, slug"),
    admin.from("humor_flavor_step_types").select("id"),
    admin.from("llm_models").select("id"),
    admin.from("llm_input_types").select("id"),
    admin.from("llm_output_types").select("id"),
  ]);

  return (
    <AdminShell title="Humor Flavor Steps">
      <div style={{ marginBottom: 20 }}>
        <StepCreator
          flavors={flavors ?? []}
          stepTypes={stepTypes ?? []}
          models={models ?? []}
          inputTypes={inputTypes ?? []}
          outputTypes={outputTypes ?? []}
        />
      </div>

      <div className="card table-wrap" style={{ padding: 20 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Flavor</th>
              <th>Order</th>
              <th>Temp</th>
              <th>Model</th>
              <th>Step Type</th>
              <th>Description</th>
              <th>Reorder</th>
            </tr>
          </thead>

          <tbody>
            {steps?.map((step) => (
              <tr key={step.id}>
                <td>{step.id}</td>
                <td>{step.humor_flavor_id}</td>
                <td>{step.order_by}</td>
                <td>{step.llm_temperature ?? "—"}</td>
                <td>{step.llm_model_id}</td>
                <td>{step.humor_flavor_step_type_id}</td>
                <td>{step.description || "—"}</td>

                <td style={{ display: "flex", gap: 8 }}>
                  <form
                    action={moveStep.bind(
                      null,
                      step.id,
                      step.humor_flavor_id,
                      "up"
                    )}
                  >
                    <button className="btn">↑</button>
                  </form>

                  <form
                    action={moveStep.bind(
                      null,
                      step.id,
                      step.humor_flavor_id,
                      "down"
                    )}
                  >
                    <button className="btn">↓</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}