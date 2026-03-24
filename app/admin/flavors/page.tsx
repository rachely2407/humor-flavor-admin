import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type FlavorRow = {
  id: number | string;
  slug?: unknown;
  name?: unknown;
  title?: unknown;
  label?: unknown;
  description?: unknown;
  created_datetime_utc?: string | null;
};

function getFlavorLabel(flavor: FlavorRow) {
  return (
    flavor.slug ??
    flavor.name ??
    flavor.title ??
    flavor.label ??
    (flavor.description ? String(flavor.description).slice(0, 40) : null) ??
    `Flavor ${flavor.id}`
  );
}

export default async function AdminFlavorsPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const { data: flavors, error } = await admin
    .from("humor_flavors")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = flavors ?? [];

  return (
    <AdminShell
      title="Humor Flavors"
      current="flavors"
      description="Browse flavor records and open individual rows for editing."
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
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 24,
                color: "#172033",
              }}
            >
              Flavor records
            </h2>
            <p
              style={{
                margin: 0,
                color: "#63708a",
                lineHeight: 1.6,
              }}
            >
              Total rows: {rows.length}
            </p>
          </div>

          <Link
            href="/admin/flavors/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 18px",
              borderRadius: 999,
              textDecoration: "none",
              color: "#fff",
              fontWeight: 700,
              background: "linear-gradient(135deg, #5b6df6, #7c5cff)",
              boxShadow: "0 14px 30px rgba(91,109,246,0.18)",
            }}
          >
            + New flavor
          </Link>
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              padding: 28,
              borderRadius: 22,
              border: "1px dashed rgba(80,98,140,0.28)",
              background: "rgba(255,255,255,0.45)",
              color: "#63708a",
            }}
          >
            No flavor rows were returned from <code>humor_flavors</code>.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              borderRadius: 22,
              border: "1px solid rgba(80,98,140,0.14)",
              background: "rgba(255,255,255,0.76)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Label</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Open</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((flavor) => (
                  <tr key={String(flavor.id)}>
                    <td style={tdStyle}>{String(flavor.id ?? "—")}</td>
                    <td style={tdStyle}>
                      <strong>{String(getFlavorLabel(flavor))}</strong>
                    </td>
                    <td style={tdStyle}>{String(flavor.description ?? "—")}</td>
                    <td style={tdStyle}>
                      {flavor.created_datetime_utc
                        ? new Date(flavor.created_datetime_utc).toLocaleString()
                        : "—"}
                    </td>
                    <td style={tdStyle}>
                      <Link href={`/admin/flavors/${flavor.id}`} style={openBtnStyle}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
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
  borderBottom: "1px solid rgba(80,98,140,0.14)",
  fontSize: 13,
  color: "#63708a",
  fontWeight: 700,
  background: "rgba(243,247,255,0.95)",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "1px solid rgba(80,98,140,0.14)",
  verticalAlign: "top",
  color: "#172033",
};

const openBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 999,
  textDecoration: "none",
  border: "1px solid rgba(80,98,140,0.14)",
  color: "#24314d",
  fontWeight: 700,
  background: "rgba(255,255,255,0.78)",
};
