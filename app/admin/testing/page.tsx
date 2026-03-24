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
          borderRadius: 28,
          background: "rgba(255,255,255,0.90)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
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
                color: "#172033",
              }}
            >
              Testing workspace
            </h2>
            <p
              style={{
                margin: 0,
                color: "#63708a",
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
              borderRadius: 999,
              background: "rgba(91,109,246,0.09)",
              border: "1px solid rgba(91,109,246,0.12)",
              color: "#4353c7",
              fontSize: 12,
              fontWeight: 700,
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
