import { AdminShell } from "@/components/admin-shell";
import { CaptionTestingPanel } from "@/components/caption-testing-panel";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function CaptionTestingPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const { data: flavors, error } = await admin
    .from("humor_flavors")
    .select("id, slug, description")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminShell
      title="Caption Testing"
      current="testing"
      description="Run caption experiments, compare flavor outputs, and review testing behavior in a cleaner professional workspace."
    >
      <section className="pretty-panel">
        <div className="toolbar">
          <div>
            <h2 className="section-title">Testing workspace</h2>
            <p className="section-subtitle">
              Use this area to generate, inspect, and compare caption behavior across humor flavors without changing your current testing functionality.
            </p>
          </div>

          <div className="badge">Live Testing</div>
        </div>

        <CaptionTestingPanel flavors={flavors ?? []} />
      </section>
    </AdminShell>
  );
}