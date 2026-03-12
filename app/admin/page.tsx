import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminHomePage() {
  const admin = supabaseAdmin();

  const [
    { count: flavorCount, error: flavorCountError },
    { count: stepCount, error: stepCountError },
    { data: recentFlavors, error: recentFlavorsError },
    { data: stepsByFlavor, error: stepsByFlavorError },
  ] = await Promise.all([
    admin.from("humor_flavors").select("*", { count: "exact", head: true }),
    admin.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
    admin
      .from("humor_flavors")
      .select("id, slug, description, created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
      .limit(5),
    admin.from("humor_flavor_steps").select("humor_flavor_id"),
  ]);

  if (flavorCountError) throw new Error(flavorCountError.message);
  if (stepCountError) throw new Error(stepCountError.message);
  if (recentFlavorsError) throw new Error(recentFlavorsError.message);
  if (stepsByFlavorError) throw new Error(stepsByFlavorError.message);

  const totalFlavors = flavorCount ?? 0;
  const totalSteps = stepCount ?? 0;
  const avgStepsPerFlavor =
    totalFlavors > 0 ? (totalSteps / totalFlavors).toFixed(1) : "0.0";

  const distribution = new Map<number, number>();
  for (const row of stepsByFlavor ?? []) {
    const flavorId = row.humor_flavor_id;
    distribution.set(flavorId, (distribution.get(flavorId) ?? 0) + 1);
  }

  const maxStepsInFlavor =
    distribution.size > 0 ? Math.max(...Array.from(distribution.values())) : 0;

  const flavorsWithNoSteps = Math.max(totalFlavors - distribution.size, 0);

  return (
    <AdminShell
      title="Dashboard"
      current="dashboard"
      description="An operational command center for flavor architecture, prompt-chain coverage, and caption generation workflows."
      stats={[
        {
          label: "Humor Flavors",
          value: totalFlavors,
          meta: "Catalog entries currently available",
        },
        {
          label: "Flavor Steps",
          value: totalSteps,
          meta: "Prompt-chain steps configured system-wide",
        },
        {
          label: "Avg. Steps / Flavor",
          value: avgStepsPerFlavor,
          meta: "Average chain complexity",
        },
        {
          label: "Coverage Gap",
          value: flavorsWithNoSteps,
          meta: "Flavors still missing step definitions",
        },
      ]}
    >
      <div className="dashboard-grid">
        <div className="metric-card span-3">
          <div className="metric-card-label">Catalog Health</div>
          <div className="metric-card-value">{totalFlavors}</div>
          <div className="metric-card-meta">
            Active humor flavor entries available for editing and testing.
          </div>
        </div>

        <div className="metric-card span-3">
          <div className="metric-card-label">Workflow Coverage</div>
          <div className="metric-card-value">{totalSteps}</div>
          <div className="metric-card-meta">
            Total number of configured prompt-chain steps across the system.
          </div>
        </div>

        <div className="metric-card span-3">
          <div className="metric-card-label">Largest Chain</div>
          <div className="metric-card-value">{maxStepsInFlavor}</div>
          <div className="metric-card-meta">
            Highest number of steps currently attached to a single flavor.
          </div>
        </div>

        <div className="metric-card span-3">
          <div className="metric-card-label">Coverage Gap</div>
          <div className="metric-card-value">{flavorsWithNoSteps}</div>
          <div className="metric-card-meta">
            Flavors that exist in the catalog but still have no configured steps.
          </div>
        </div>

        <Link href="/admin/flavors" className="dashboard-link-card span-4">
          <div className="dashboard-link-kicker">Catalog</div>
          <h2>🎭 Humor Flavors</h2>
          <p>
            Review, create, edit, and organize the flavor catalog with a cleaner,
            more intentional operational view.
          </p>
          <div className="dashboard-link-metric">{totalFlavors}</div>
          <div className="dashboard-link-meta">Total flavor records available</div>
          <div className="dashboard-link-cta">Open flavor catalog →</div>
        </Link>

        <Link href="/admin/steps" className="dashboard-link-card span-4">
          <div className="dashboard-link-kicker">Workflow</div>
          <h2>⚙️ Flavor Steps</h2>
          <p>
            Manage sequencing, structure, and step configuration logic for every
            humor flavor prompt chain.
          </p>
          <div className="dashboard-link-metric">{totalSteps}</div>
          <div className="dashboard-link-meta">Step definitions across all flavors</div>
          <div className="dashboard-link-cta">Open step manager →</div>
        </Link>

        <Link href="/admin/testing" className="dashboard-link-card span-4">
          <div className="dashboard-link-kicker">Testing</div>
          <h2>🧪 Caption Testing</h2>
          <p>
            Run generation workflows against the image test set and inspect how each
            flavor chain performs end to end.
          </p>
          <div className="dashboard-link-metric">{avgStepsPerFlavor}</div>
          <div className="dashboard-link-meta">Average steps driving each chain</div>
          <div className="dashboard-link-cta">Open testing workspace →</div>
        </Link>

        <section className="insight-card span-7">
          <h3 className="insight-title">Recent flavor activity</h3>
          <p className="insight-copy">
            Recently created flavors help you quickly spot new entries that may still
            need descriptions, step coverage, or testing.
          </p>

          <div className="activity-list">
            {(recentFlavors ?? []).length > 0 ? (
              recentFlavors!.map((flavor) => {
                const count = distribution.get(flavor.id) ?? 0;

                return (
                  <div key={flavor.id} className="activity-item">
                    <div className="activity-item-left">
                      <div className="activity-item-title">
                        {flavor.slug || `Flavor #${flavor.id}`}
                      </div>
                      <div className="activity-item-subtitle">
                        {flavor.description || "No description added yet."}
                      </div>
                    </div>

                    <div className="activity-item-right">
                      <div className={`badge ${count === 0 ? "badge-warning" : ""}`}>
                        {count} step{count === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="activity-item">
                <div className="activity-item-left">
                  <div className="activity-item-title">No flavor activity yet</div>
                  <div className="activity-item-subtitle">
                    Create your first humor flavor to begin building the catalog.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="insight-card span-5">
          <h3 className="insight-title">Operational summary</h3>
          <p className="insight-copy">
            Use this view to prioritize missing setup, jump directly into editing,
            and keep the flavor system moving with less guesswork.
          </p>

          <div className="quick-links">
            <Link href="/admin/flavors" className="quick-link">
              <div>
                <div className="quick-link-title">Review flavor catalog</div>
                <div className="quick-link-copy">
                  Audit naming, descriptions, and flavor completeness.
                </div>
              </div>
              <div className="badge">Open</div>
            </Link>

            <Link href="/admin/steps" className="quick-link">
              <div>
                <div className="quick-link-title">Refine step structure</div>
                <div className="quick-link-copy">
                  Improve sequence quality and prompt-chain coverage.
                </div>
              </div>
              <div className="badge">Open</div>
            </Link>

            <Link href="/admin/testing" className="quick-link">
              <div>
                <div className="quick-link-title">Run caption tests</div>
                <div className="quick-link-copy">
                  Generate outputs and validate chain behavior.
                </div>
              </div>
              <div className="badge badge-success">Live</div>
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}