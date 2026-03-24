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
              borderRadius: 28,
              background: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(255,255,255,0.72)",
              boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
            }}
          >
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
                marginBottom: 12,
              }}
            >
              Admin Tool
            </div>

            <h2
              style={{
                margin: "0 0 8px 0",
                fontSize: 18,
                color: "#172033",
              }}
            >
              {card.title}
            </h2>

            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1,
                color: "#172033",
                marginBottom: 10,
              }}
            >
              {card.count}
            </div>

            <p
              style={{
                margin: "0 0 18px 0",
                color: "#63708a",
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
                borderRadius: 999,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 700,
                background: "linear-gradient(135deg, #5b6df6, #7c5cff)",
                boxShadow: "0 14px 30px rgba(91,109,246,0.18)",
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
            borderRadius: 28,
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: 24,
              color: "#172033",
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
                  borderRadius: 18,
                  background: "rgba(244,247,255,0.95)",
                  border: "1px solid rgba(80,98,140,0.12)",
                  color: "#32405e",
                  fontWeight: 600,
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
            borderRadius: 28,
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px 0",
              fontSize: 24,
              color: "#172033",
            }}
          >
            Quick snapshot
          </h2>

          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                padding: 18,
                borderRadius: 20,
                background: "rgba(244,247,255,0.95)",
                border: "1px solid rgba(80,98,140,0.12)",
              }}
            >
              <div style={{ color: "#63708a", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                Total images
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#172033" }}>
                {imageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 20,
                background: "rgba(244,247,255,0.95)",
                border: "1px solid rgba(80,98,140,0.12)",
              }}
            >
              <div style={{ color: "#63708a", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                Public images
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#172033" }}>
                {publicImageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 20,
                background: "rgba(244,247,255,0.95)",
                border: "1px solid rgba(80,98,140,0.12)",
              }}
            >
              <div style={{ color: "#63708a", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                Total captions
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#172033" }}>
                {captionCount ?? 0}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}