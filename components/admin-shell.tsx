import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { key: "dashboard", href: "/admin", label: "Dashboard" },
  { key: "flavors", href: "/admin/flavors", label: "Flavors" },
  { key: "steps", href: "/admin/steps", label: "Steps" },
  { key: "images", href: "/admin/images", label: "Images" },
  { key: "testing", href: "/admin/testing", label: "Testing" },
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
          "linear-gradient(140deg, transparent 0 70%, rgba(15,98,254,0.16) 70% 83%, transparent 83%), linear-gradient(180deg, #f5f0e6 0%, #efe3c7 100%)",
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
              borderRadius: 8,
              background: "rgba(250,246,238,0.98)",
              border: "3px solid #111111",
              boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: 0,
                  background: "#f4c300",
                  border: "2px solid #111111",
                  color: "#111111",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Admin Panel
              </div>

              <h2
                style={{
                  margin: "14px 0 8px 0",
                  fontSize: 28,
                  lineHeight: 1.1,
                  color: "#111111",
                  textTransform: "uppercase",
                }}
              >
                Humor Project
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#545454",
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
                      borderRadius: 0,
                      fontWeight: 900,
                      fontSize: 15,
                      textDecoration: "none",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: active ? "#fff8ea" : "#111111",
                      background: active ? "#d92d20" : "#fff9ee",
                      border: "3px solid #111111",
                      boxShadow: active
                        ? "6px 6px 0 rgba(17,17,17,0.96)"
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
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, transparent 0 84%, rgba(15,98,254,0.22) 84% 100%), linear-gradient(180deg, rgba(255,251,243,0.98), rgba(246,237,213,0.96))",
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
                  background: "#0f62fe",
                  border: "2px solid #111111",
                  color: "#fff8ea",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
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
                  color: "#111111",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </h1>

              {description ? (
                <p
                  style={{
                    marginTop: 12,
                    marginBottom: 0,
                    color: "#545454",
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
