import { AdminShell } from "@/components/admin-shell";
import { CaptionTestingPanel } from "@/components/caption-testing-panel";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type FlavorRow = {
  id: number;
  slug?: unknown;
  name?: unknown;
  title?: unknown;
  label?: unknown;
  description?: unknown;
};

function normalizeFlavor(flavor: FlavorRow) {
  const label =
    flavor.slug ??
    flavor.name ??
    flavor.title ??
    flavor.label ??
    `Flavor ${flavor.id}`;

  return {
    id: flavor.id,
    slug: String(label),
    description:
      flavor.description === undefined || flavor.description === null
        ? null
        : String(flavor.description),
  };
}

export default async function CaptionTestingPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const { data: rawFlavors, error } = await admin
    .from("humor_flavors")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const flavors = (rawFlavors ?? []).map(normalizeFlavor);

  return (
    <AdminShell
      title="Caption Testing"
      current="testing"
      description="Run caption experiments and compare outputs."
    >
      <section
        style={{
          padding: 28,
          borderRadius: 8,
          background: "#fff8ea",
          border: "3px solid #111111",
          boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
              margin: "0 0 8px 0",
              fontSize: 24,
              lineHeight: 1.15,
              color: "#111111",
              textTransform: "uppercase",
            }}
          >
              Testing workspace
            </h2>
            <p
              style={{
              margin: 0,
              color: "#545454",
              lineHeight: 1.6,
              fontSize: 15,
            }}
            >
              Flavor options loaded: {flavors.length}
            </p>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 12px",
              borderRadius: 0,
              background: "#0f62fe",
              border: "2px solid #111111",
              color: "#fff8ea",
              fontSize: 12,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Live Testing
          </div>
        </div>

        <CaptionTestingPanel flavors={flavors} />
      </section>
    </AdminShell>
  );
}
