import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminFlavorsPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const { data: flavors, error } = await admin
    .from("humor_flavors")
    .select("id, created_datetime_utc, description, slug")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <AdminShell
      title="Humor Flavors"
      current="flavors"
      description="Manage humor flavor records in a cleaner, more professional catalog view."
    >
      <section className="pretty-panel">
        <div className="toolbar">
          <div>
            <h2 className="section-title">Flavor catalog</h2>
            <p className="section-subtitle">
              Review all humor flavor entries, open records, and create new ones.
            </p>
          </div>

          <Link href="/admin/flavors/new" className="btn btn-primary">
            + New humor flavor
          </Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 100 }}>ID</th>
                <th style={{ width: 220 }}>Slug</th>
                <th>Description</th>
                <th style={{ width: 240 }}>Created</th>
                <th style={{ width: 130 }}>Open</th>
              </tr>
            </thead>
            <tbody>
              {flavors?.map((flavor) => (
                <tr key={flavor.id}>
                  <td>{flavor.id}</td>
                  <td>
                    <strong>{flavor.slug}</strong>
                  </td>
                  <td>{flavor.description || "—"}</td>
                  <td>
                    {flavor.created_datetime_utc
                      ? new Date(flavor.created_datetime_utc).toLocaleString()
                      : "—"}
                  </td>
                  <td>
                    <Link
                      href={`/admin/flavors/${flavor.id}`}
                      className="btn"
                    >
                      Open
                    </Link>
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