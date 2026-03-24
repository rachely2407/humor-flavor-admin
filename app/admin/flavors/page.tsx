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
                color: "#111111",
                textTransform: "uppercase",
              }}
            >
              Flavor records
            </h2>
            <p
              style={{
                margin: 0,
                color: "#545454",
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
              borderRadius: 0,
              textDecoration: "none",
              color: "#fff8ea",
              fontWeight: 900,
              background: "#d92d20",
              border: "3px solid #111111",
              boxShadow: "6px 6px 0 rgba(17,17,17,0.96)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            + New flavor
          </Link>
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              padding: 28,
              borderRadius: 8,
              border: "3px dashed #111111",
              background: "#fffdf7",
              color: "#545454",
            }}
          >
            No flavor rows were returned from <code>humor_flavors</code>.
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
