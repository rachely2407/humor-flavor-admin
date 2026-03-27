import Link from "next/link";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { key: "dashboard", href: "/admin", label: "Dashboard" },
  { key: "flavors", href: "/admin/flavors", label: "Flavors" },
  { key: "steps", href: "/admin/steps", label: "Steps" },
  { key: "images", href: "/admin/images", label: "Images" },
  { key: "testing", href: "/admin/testing", label: "Testing" },
  { key: "users", href: "/admin/manage/users", label: "Users" },
  { key: "terms", href: "/admin/manage/terms", label: "Terms" },
  { key: "humor-flavor-mix", href: "/admin/manage/humor-flavor-mix", label: "Flavor Mix" },
  { key: "captions", href: "/admin/manage/captions", label: "Captions" },
  { key: "caption-requests", href: "/admin/manage/caption-requests", label: "Requests" },
  { key: "caption-examples", href: "/admin/manage/caption-examples", label: "Examples" },
  { key: "llm-models", href: "/admin/manage/llm-models", label: "LLM Models" },
  { key: "llm-providers", href: "/admin/manage/llm-providers", label: "Providers" },
  { key: "llm-prompt-chains", href: "/admin/manage/llm-prompt-chains", label: "Prompt Chains" },
  { key: "llm-model-responses", href: "/admin/manage/llm-model-responses", label: "Responses" },
  { key: "signup-domains", href: "/admin/manage/signup-domains", label: "Domains" },
  {
    key: "whitelisted-email-addresses",
    href: "/admin/manage/whitelisted-email-addresses",
    label: "Whitelist",
  },
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
        background: "var(--shell-bg)",
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
              background: "var(--shell-panel)",
              border: "3px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: 0,
                  background: "var(--badge-yellow-bg)",
                  border: "2px solid var(--line)",
                  color: "var(--text)",
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
                  color: "var(--text)",
                  textTransform: "uppercase",
                }}
              >
                Humor Project
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  fontSize: 15,
                }}
              >
                Manage tables, prompt-chain configuration, and grading-facing
                tools.
              </p>
            </div>

            <div style={{ marginBottom: 22 }}>
              <ThemeToggle />
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
                      color: active ? "var(--nav-active-text)" : "var(--text)",
                      background: active ? "var(--nav-active-bg)" : "var(--nav-bg)",
                      border: "3px solid var(--line)",
                      boxShadow: active
                        ? "var(--shadow-soft)"
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
                background: "var(--shell-header)",
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
                  background: "var(--badge-blue-bg)",
                  border: "2px solid var(--line)",
                  color: "var(--badge-blue-text)",
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
                  color: "var(--text)",
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
                    color: "var(--muted)",
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
