import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";

function DashboardCard({
  href,
  emoji,
  title,
  description,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "block",
        padding: 26,
        borderRadius: 30,
        border: "1px solid var(--border)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.58), rgba(255,255,255,0.16)), var(--card)",
        boxShadow: "var(--shadow-soft)",
        transition: "0.22s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -24,
          top: -24,
          width: 120,
          height: 120,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(244,114,182,0.16), transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 700,
            border: "1px solid var(--border)",
            background: "var(--accent)",
            marginBottom: 14,
          }}
        >
          {emoji} Tool
        </div>

        <h2
          style={{
            margin: "0 0 10px 0",
            fontSize: "1.45rem",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            opacity: 0.82,
            lineHeight: 1.7,
            fontSize: "1rem",
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  await requireMatrixOrSuperadmin();

  return (
    <AdminShell title="Humor Flavor Admin">
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <DashboardCard
          href="/admin/flavors"
          emoji="🍓"
          title="Humor Flavors"
          description="Create, edit, and delete humor flavors with a cleaner admin interface."
        />

        <DashboardCard
          href="/admin/steps"
          emoji="🧠"
          title="Flavor Steps"
          description="Create, inspect, and reorder prompt-chain steps for each humor flavor."
        />

        <DashboardCard
          href="/admin/testing"
          emoji="🪄"
          title="Caption Testing"
          description="Generate captions from the API for a selected flavor and inspect results."
        />
      </div>
    </AdminShell>
  );
}