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

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminShell title="Humor Flavors">
      <div style={{ marginBottom: 16 }}>
        <Link className="btn btn-primary" href="/admin/flavors/new">
          + New humor flavor
        </Link>
      </div>

      <div className="card table-wrap" style={{ padding: 20 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Created</th>
              <th>Open</th>
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
                  <Link className="btn" href={`/admin/flavors/${flavor.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}