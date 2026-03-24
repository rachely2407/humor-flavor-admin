import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { key: "dashboard", href: "/admin", label: "Dashboard" },
  { key: "flavors", href: "/admin/flavors", label: "Flavors" },
  { key: "steps", href: "/admin/steps", label: "Steps" },
  { key: "images", href: "/admin/images", label: "Images" },
  { key: "testing", href: "/admin/testing", label: "Testing" },
  { key: "humor-mix", href: "/admin/humor-mix", label: "Humor Mix" },
];

export function AdminShell({
  title,
  description,
  current,
  children,
}: {
  title: string;
  description?: string;
  current?: string;
  children: ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #edf3ff 0%, #dfe9fb 100%)",
        padding: "28px 0",
      }}
    >
      <div
        style={{
          width: "min(1400px, calc(100% - 32px))",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px minmax(0, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <aside
            style={{
              position: "sticky",
              top: 24,
              padding: 22,
              borderRadius: 28,
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "0 18px 50px rgba(73, 98, 146, 0.16)",
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "rgba(91,109,246,0.10)",
                  border: "1px solid rgba(91,109,246,0.14)",
                  color: "#4353c7",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Admin Panel
              </div>

              <h2
                style={{
                  margin: "14px 0 8px 0",
                  fontSize: 28,
                  lineHeight: 1.1,
                  color: "#172033",
                }}
              >
                Humor Project
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#63708a",
                  lineHeight: 1.6,
                  fontSize: 15,
                }}
              >
                Manage tables, prompt-chain configuration, and grading-facing
                tools.
              </p>
            </div>

            <nav
              style={{
                display: "grid",
                gap: 10,
              }}
            >
              {navItems.map((item) => {
                const active = current === item.key;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      borderRadius: 16,
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: "none",
                      color: active ? "#ffffff" : "#32405e",
                      background: active
                        ? "linear-gradient(135deg, #5b6df6, #7c5cff)"
                        : "rgba(255,255,255,0.72)",
                      border: active
                        ? "1px solid transparent"
                        : "1px solid rgba(80,98,140,0.14)",
                      boxShadow: active
                        ? "0 14px 30px rgba(91,109,246,0.22)"
                        : "none",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section style={{ minWidth: 0 }}>
            <header
              style={{
                marginBottom: 22,
                padding: 28,
                borderRadius: 28,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.93), rgba(245,248,255,0.88))",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 18px 50px rgba(73, 98, 146, 0.14)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "rgba(91,109,246,0.10)",
                  border: "1px solid rgba(91,109,246,0.14)",
                  color: "#4353c7",
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Admin
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(30px, 4vw, 44px)",
                  lineHeight: 1.05,
                  color: "#172033",
                }}
              >
                {title}
              </h1>

              {description ? (
                <p
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    color: "#63708a",
                    lineHeight: 1.7,
                    maxWidth: 900,
                    fontSize: 16,
                  }}
                >
                  {description}
                </p>
              ) : null}
            </header>

            <div style={{ display: "grid", gap: 22 }}>{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}