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
    { count: voteCount },
    { count: saveCount },
    { data: voteRows },
  ] = await Promise.all([
    admin.from("humor_flavors").select("*", { count: "exact", head: true }),
    admin.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
    admin.from("images").select("*", { count: "exact", head: true }),
    admin.from("captions").select("*", { count: "exact", head: true }),
    admin.from("images").select("*", { count: "exact", head: true }).eq("is_public", true),
    admin.from("caption_votes").select("*", { count: "exact", head: true }),
    admin.from("caption_saves").select("*", { count: "exact", head: true }),
    admin
      .from("caption_votes")
      .select("vote_value, is_from_study, created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
      .limit(1000),
  ]);

  const recentVoteRows = voteRows ?? [];
  const totalVoteValue = recentVoteRows.reduce(
    (sum, vote) => sum + Number(vote.vote_value ?? 0),
    0
  );
  const averageVote =
    recentVoteRows.length > 0
      ? (totalVoteValue / recentVoteRows.length).toFixed(2)
      : "0.00";
  const studyVoteCount = recentVoteRows.filter((vote) => Boolean(vote.is_from_study)).length;
  const positiveVoteCount = recentVoteRows.filter((vote) => Number(vote.vote_value ?? 0) > 0).length;
  const negativeVoteCount = recentVoteRows.filter((vote) => Number(vote.vote_value ?? 0) < 0).length;

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
                  ? "var(--surface-cream)"
                  : card.title === "Flavor Steps"
                  ? "var(--surface-yellow)"
                  : card.title === "Images"
                  ? "var(--surface-blue)"
                  : "var(--surface-red)",
              border: "3px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 12px",
                borderRadius: 0,
                background: "var(--surface-soft)",
                border: "2px solid var(--line)",
                color: "var(--text)",
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
                    ? "var(--surface-text-on-dark)"
                    : "var(--text)",
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
                    ? "var(--surface-text-on-dark)"
                    : "var(--text)",
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
                    ? "color-mix(in srgb, var(--surface-text-on-dark) 84%, transparent)"
                    : "var(--muted)",
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
                color: "var(--text)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                background: "var(--surface-soft)",
                border: "3px solid var(--line)",
                boxShadow: "var(--shadow-soft)",
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
            background: "var(--surface-cream)",
            border: "3px solid var(--line)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px 0",
              fontSize: 24,
              color: "var(--text)",
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
              `Caption votes tracked: ${voteCount ?? 0}.`,
              `Caption saves tracked: ${saveCount ?? 0}.`,
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  borderRadius: 0,
                  background: item.includes("CRUD")
                    ? "var(--surface-blue)"
                    : "var(--surface-soft)",
                  border: "2px solid var(--line)",
                  color: item.includes("CRUD")
                    ? "var(--surface-text-on-dark)"
                    : "var(--text)",
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
            background: "var(--surface-deep)",
            border: "3px solid var(--line)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h2
            style={{
              margin: "0 0 14px 0",
              fontSize: 24,
              color: "var(--surface-text-on-dark)",
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
                background: "var(--surface-yellow)",
                border: "2px solid var(--line)",
              }}
            >
              <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total images
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)" }}>
                {imageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "var(--surface-cream)",
                border: "2px solid var(--line)",
              }}
            >
              <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Public images
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)" }}>
                {publicImageCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "var(--surface-blue)",
                border: "2px solid var(--line)",
              }}
            >
              <div style={{ color: "var(--surface-text-on-dark)", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total captions
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--surface-text-on-dark)" }}>
                {captionCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "var(--surface-red)",
                border: "2px solid var(--line)",
              }}
            >
              <div style={{ color: "var(--surface-text-on-dark)", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total votes
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--surface-text-on-dark)" }}>
                {voteCount ?? 0}
              </div>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 0,
                background: "var(--surface-soft)",
                border: "2px solid var(--line)",
              }}
            >
              <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 900, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Total saves
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)" }}>
                {saveCount ?? 0}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {[
          { label: "Average vote", value: averageVote, background: "var(--surface-yellow)", dark: false },
          { label: "Study votes", value: studyVoteCount, background: "var(--surface-blue)", dark: true },
          { label: "Positive votes", value: positiveVoteCount, background: "var(--surface-cream)", dark: false },
          { label: "Negative votes", value: negativeVoteCount, background: "var(--surface-red)", dark: true },
        ].map((stat) => (
          <article
            key={stat.label}
            style={{
              padding: 22,
              borderRadius: 8,
              background: stat.background,
              border: "3px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: stat.dark ? "var(--surface-text-on-dark)" : "var(--text)",
                marginBottom: 10,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: stat.dark ? "var(--surface-text-on-dark)" : "var(--text)",
              }}
            >
              {stat.value}
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
