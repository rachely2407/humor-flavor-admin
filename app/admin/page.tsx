import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminDashboardPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const [
    { count: flavorCount },
    { count: stepCount },
    { count: imageCount },
    { count: captionCount },
    { count: publicImageCount },
  ] = await Promise.all([
    admin.from("humor_flavors").select("*", { count: "exact", head: true }),
    admin.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
    admin.from("images").select("*", { count: "exact", head: true }),
    admin.from("captions").select("*", { count: "exact", head: true }),
    admin.from("images").select("*", { count: "exact", head: true }).eq("is_public", true),
  ]);

  const cards = [
    {
      title: "Humor Flavors",
      count: flavorCount ?? 0,
      description: "Manage humor flavor definitions and descriptions.",
      href: "/admin/flavors",
      button: "Open flavors",
    },
    {
      title: "Flavor Steps",
      count: stepCount ?? 0,
      description: "Edit prompt-chain steps, order, and model settings.",
      href: "/admin/steps",
      button: "Open steps",
    },
    {
      title: "Images",
      count: imageCount ?? 0,
      description: "Create, inspect, edit, and delete image records.",
      href: "/admin/images",
      button: "Open images",
    },
    {
      title: "Testing",
      count: captionCount ?? 0,
      description: "Review output-related records and testing workflows.",
      href: "/admin/testing",
      button: "Open testing",
    },
  ];

  return (
    <AdminShell
      title="Dashboard"
      current="dashboard"
      description="Protected admin overview for managing flavors, steps, images, and testing tools."
    >
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {cards.map((card) => (
          <article
            key={card.title}
            style={{
              padding: 24,
              borderRadius: 8,
              background:
                card.title === "Humor Flavors"
                  ? "#fff8ea"
                  : card.title === "Flavor Steps"
                  ? "#f4c300"
                  : card.title === "Images"
                  ? "#0f62fe"
                  : "#d92d20",
              border: "3px solid #111111",
              boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 12px",
                borderRadius: 0,
                background: "rgba(255,248,234,0.92)",
                border: "2px solid #111111",
                color: "#111111",
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Admin Tool
            </div>

            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
                color:
                  card.title === "Images" || card.title === "Testing"
                    ? "#fff8ea"
                    : "#111111",
                textTransform: "uppercase",
              }}
            >
              {card.title}
            </h2>

            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1,
                color:
                  card.title === "Images" || card.title === "Testing"
                    ? "#fff8ea"
                    : "#111111",
                marginBottom: 10,
              }}
            >
              {card.count}
            </div>

            <p
              style={{
                margin: "0 0 18px 0",
                color:
                  card.title === "Images" || card.title === "Testing"
                    ? "rgba(255,248,234,0.86)"
                    : "#323232",
                lineHeight: 1.6,
                minHeight: 72,
              }}
            >
              {card.description}
            </p>

            <Link
              href={card.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "0 18px",
                borderRadius: 0,
                textDecoration: "none",
                color: "#111111",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: "#fff8ea",
                border: "3px solid #111111",
                boxShadow: "6px 6px 0 rgba(17,17,17,0.96)",
              }}
            >
              {card.button}
            </Link>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 18,
        }}
      >
        <div
          style={{
            padding: 28,
            borderRadius: 8,
            background: "#fff8ea",
            border: "3px solid #111111",
            boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: 24,
              color: "#111111",
              textTransform: "uppercase",
            }}
          >
            Admin system status
          </h2>

          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {[
              "Google login gate is enabled for admin access.",
              "Superadmin-only protection is active on admin routes.",
              "CRUD actions run through protected server routes.",
              "Audit fields are included for staging database writes.",
              "Images, flavors, and steps are all accessible from one admin nav.",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 0,
                  background: item.includes("CRUD") ? "#0f62fe" : "#fffdf7",
                  border: "2px solid #111111",
                  color: item.includes("CRUD") ? "#fff8ea" : "#111111",
                  fontWeight: 800,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 28,
            borderRadius: 8,
            background: "#111111",
            border: "3px solid #111111",
            boxShadow: "10px 10px 0 rgba(217,45,32,0.92)",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px 0",
              fontSize: 24,
              color: "#fff8ea",
              textTransform: "uppercase",
            }}
          >
            Quick snapshot
          </h2>

          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "#f4c300",
                border: "2px solid #111111",
              }}
            >
              <div style={{ color: "#111111", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total images
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#111111" }}>
                {imageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "#fff8ea",
                border: "2px solid #111111",
              }}
            >
              <div style={{ color: "#111111", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Public images
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#111111" }}>
                {publicImageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "#0f62fe",
                border: "2px solid #111111",
              }}
            >
              <div style={{ color: "#fff8ea", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total captions
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff8ea" }}>
                {captionCount ?? 0}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
