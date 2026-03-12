import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

type AdminShellProps = {
  title: string;
  description?: string;
  current?: "dashboard" | "flavors" | "steps" | "testing";
  children: React.ReactNode;
};

export function AdminShell({
  title,
  description = "Manage humor flavors, prompt-chain steps, and caption testing.",
  current,
  children,
}: AdminShellProps) {
  return (
    <main className="container">
      <section className="hero-shell">
        <div className="hero-shell-top">
          <div>
            <div className="hero-badge">Humor Flavor Admin</div>
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{description}</p>
          </div>

          <ThemeToggle />
        </div>

        <nav className="nav-row">
          <Link
            href="/admin"
            className={`nav-chip ${current === "dashboard" ? "nav-chip-active" : ""}`}
          >
            Dashboard
          </Link>

          <Link
            href="/admin/flavors"
            className={`nav-chip ${current === "flavors" ? "nav-chip-active" : ""}`}
          >
            Humor Flavors
          </Link>

          <Link
            href="/admin/steps"
            className={`nav-chip ${current === "steps" ? "nav-chip-active" : ""}`}
          >
            Flavor Steps
          </Link>

          <Link
            href="/admin/testing"
            className={`nav-chip ${current === "testing" ? "nav-chip-active" : ""}`}
          >
            Caption Testing
          </Link>
        </nav>
      </section>

      <section className="page-stack">{children}</section>
    </main>
  );
}