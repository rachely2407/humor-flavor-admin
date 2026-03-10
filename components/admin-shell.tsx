import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          marginBottom: 24,
          padding: 28,
          border: "1px solid var(--border)",
          borderRadius: 32,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,255,255,0.14)), var(--card)",
          backdropFilter: "blur(18px)",
          boxShadow: "var(--shadow-pink)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 220,
            height: 220,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(244,114,182,0.18), transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid var(--border)",
                background: "var(--accent)",
                marginBottom: 14,
              }}
            >
              🎀 Prompt Chain Tool
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2rem, 3vw, 3rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                marginTop: 12,
                marginBottom: 0,
                opacity: 0.82,
                lineHeight: 1.7,
                fontSize: "1.02rem",
              }}
            >
              Manage humor flavors, prompt-chain steps, and caption testing in a
              cleaner Matrix-style admin.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <ThemeToggle />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <Link
            href="/"
            className="btn"
            style={{ minWidth: 120 }}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/flavors"
            className="btn"
            style={{ minWidth: 140 }}
          >
            Humor Flavors
          </Link>

          <Link
            href="/admin/steps"
            className="btn"
            style={{ minWidth: 130 }}
          >
            Flavor Steps
          </Link>
        </div>
      </section>

      {children}
    </main>
  );
}