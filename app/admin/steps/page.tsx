import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminShell } from "@/components/admin-shell";
import { StepCreator } from "@/components/step-creator";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getFlavorLabel, getFlavorRefKey, getOrderKey } from "@/lib/stepSchema";

async function moveStep(stepId: number, direction: "up" | "down") {
  "use server";

  const user = await requireMatrixOrSuperadmin();
  const admin = supabaseAdmin();

  const { data: allSteps, error } = await admin
    .from("humor_flavor_steps")
    .select("*");

  if (error || !allSteps || allSteps.length === 0) return;

  const sample = allSteps[0];
  const flavorKey = getFlavorRefKey(sample);
  const orderKey = getOrderKey(sample);

  const current = allSteps.find((row) => Number(row.id) === stepId);
  if (!current) return;

  const currentFlavor = current[flavorKey];

  const siblings = allSteps
    .filter((row) => row[flavorKey] === currentFlavor)
    .sort((a, b) => {
      const ao = Number(a[orderKey] ?? 0);
      const bo = Number(b[orderKey] ?? 0);
      if (ao !== bo) return ao - bo;
      return Number(a.id ?? 0) - Number(b.id ?? 0);
    });

  const index = siblings.findIndex((row) => Number(row.id) === stepId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const a = siblings[index];
  const b = siblings[swapIndex];
  const now = new Date().toISOString();

  const aOrder = Number(a[orderKey] ?? 0);
  const bOrder = Number(b[orderKey] ?? 0);

  const { error: errorA } = await admin
    .from("humor_flavor_steps")
    .update({
      [orderKey]: bOrder,
      modified_by_user_id: user.id,
      modified_datetime_utc: now,
    })
    .eq("id", a.id);

  if (errorA) throw new Error(errorA.message);

  const { error: errorB } = await admin
    .from("humor_flavor_steps")
    .update({
      [orderKey]: aOrder,
      modified_by_user_id: user.id,
      modified_datetime_utc: now,
    })
    .eq("id", b.id);

  if (errorB) throw new Error(errorB.message);

  revalidatePath("/admin/steps");
}

export default async function AdminStepsPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const [
    { data: steps, error: stepsError },
    { data: rawFlavors, error: flavorsError },
    { data: stepTypes, error: stepTypesError },
    { data: models, error: modelsError },
    { data: inputTypes, error: inputTypesError },
    { data: outputTypes, error: outputTypesError },
  ] = await Promise.all([
    admin.from("humor_flavor_steps").select("*"),
    admin.from("humor_flavors").select("*").order("id", { ascending: true }),
    admin.from("humor_flavor_step_types").select("id").order("id", { ascending: true }),
    admin.from("llm_models").select("id").order("id", { ascending: true }),
    admin.from("llm_input_types").select("id").order("id", { ascending: true }),
    admin.from("llm_output_types").select("id").order("id", { ascending: true }),
  ]);

  if (stepsError) throw new Error(stepsError.message);
  if (flavorsError) throw new Error(flavorsError.message);
  if (stepTypesError) throw new Error(stepTypesError.message);
  if (modelsError) throw new Error(modelsError.message);
  if (inputTypesError) throw new Error(inputTypesError.message);
  if (outputTypesError) throw new Error(outputTypesError.message);

  const rows = steps ?? [];
  const sample = rows[0] ?? {};
  const flavorKey = getFlavorRefKey(sample);
  const orderKey = getOrderKey(sample);

  const flavors =
    (rawFlavors ?? []).map((flavor) => ({
      id: flavor.id,
      slug: String(getFlavorLabel(flavor)),
    })) ?? [];

  const flavorLabelMap = new Map(
    (rawFlavors ?? []).map((flavor) => [Number(flavor.id), String(getFlavorLabel(flavor))])
  );

  const sortedRows = [...rows].sort((a, b) => {
    const af = Number(a[flavorKey] ?? 0);
    const bf = Number(b[flavorKey] ?? 0);
    if (af !== bf) return af - bf;

    const ao = Number(a[orderKey] ?? 0);
    const bo = Number(b[orderKey] ?? 0);
    if (ao !== bo) return ao - bo;

    return Number(a.id ?? 0) - Number(b.id ?? 0);
  });

  return (
    <AdminShell
      title="Flavor Steps"
      current="steps"
      description="Review step records, create new ones, and adjust ordering."
    >
      <section
        style={{
          padding: 28,
          borderRadius: 8,
          background: "#fff8ea",
          border: "3px solid #111111",
          boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
          marginBottom: 22,
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 24, color: "#111111", textTransform: "uppercase" }}>
            Create step
          </h2>
          <p style={{ margin: 0, color: "#545454", lineHeight: 1.6 }}>
            Add a new humor flavor step using the protected admin API.
          </p>
        </div>

        <StepCreator
          flavors={flavors}
          stepTypes={stepTypes ?? []}
          models={models ?? []}
          inputTypes={inputTypes ?? []}
          outputTypes={outputTypes ?? []}
        />
      </section>

      <section
        style={{
          padding: 28,
          borderRadius: 8,
          background: "#fffdf7",
          border: "3px solid #111111",
          boxShadow: "10px 10px 0 rgba(15,98,254,0.88)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 24, color: "#111111", textTransform: "uppercase" }}>
            Step definitions
          </h2>
          <p style={{ margin: 0, color: "#545454", lineHeight: 1.6 }}>
            Total rows: {sortedRows.length}
          </p>
        </div>

        {sortedRows.length === 0 ? (
          <div
            style={{
              padding: 28,
              borderRadius: 8,
              border: "3px dashed #111111",
              background: "#fff8ea",
              color: "#545454",
            }}
          >
            No step rows were returned from <code>humor_flavor_steps</code>.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: "3px solid #111111",
              background: "#fffaf0",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Flavor</th>
                  <th style={thStyle}>Flavor Ref</th>
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}>Model</th>
                  <th style={thStyle}>Step Type</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Adjust</th>
                  <th style={thStyle}>Open</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((step) => {
                  const flavorRef = Number(step[flavorKey] ?? 0);

                  return (
                    <tr key={String(step.id)}>
                      <td style={tdStyle}>{String(step.id ?? "—")}</td>
                      <td style={tdStyle}>{flavorLabelMap.get(flavorRef) ?? "—"}</td>
                      <td style={tdStyle}>{String(step[flavorKey] ?? "—")}</td>
                      <td style={tdStyle}>{String(step[orderKey] ?? "—")}</td>
                      <td style={tdStyle}>
                        {String(step.llm_model_id ?? step.model_id ?? "—")}
                      </td>
                      <td style={tdStyle}>
                        {String(step.humor_flavor_step_type_id ?? step.step_type_id ?? "—")}
                      </td>
                      <td style={tdStyle}>{String(step.description ?? "—")}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <form action={moveStep.bind(null, Number(step.id), "up")}>
                            <button type="submit" style={smallBtnStyle}>↑</button>
                          </form>
                          <form action={moveStep.bind(null, Number(step.id), "down")}>
                            <button type="submit" style={smallBtnStyle}>↓</button>
                          </form>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <Link href={`/admin/steps/${step.id}`} style={openBtnStyle}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "2px solid #111111",
  fontSize: 13,
  color: "#111111",
  fontWeight: 900,
  background: "#f4c300",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "2px solid #111111",
  verticalAlign: "top",
  color: "#111111",
};

const openBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 0,
  textDecoration: "none",
  border: "2px solid #111111",
  color: "#111111",
  fontWeight: 900,
  background: "#fffdf7",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const smallBtnStyle: React.CSSProperties = {
  minHeight: 34,
  minWidth: 34,
  borderRadius: 0,
  border: "2px solid #111111",
  background: "#0f62fe",
  color: "#fff8ea",
  fontWeight: 900,
  cursor: "pointer",
};
