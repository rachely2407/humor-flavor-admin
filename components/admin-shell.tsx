import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

type HeroStat = {
  label: string;
  value: string | number;
  meta?: string;
};

type AdminShellProps = {
  title: string;
  description?: string;
  current?: "dashboard" | "flavors" | "steps" | "testing";
  children: React.ReactNode;
  stats?: HeroStat[];
};

export function AdminShell({
  title,
  description = "Manage humor flavors, prompt-chain steps, and caption testing in a polished internal workspace.",
  current,
  children,
  stats,
}: AdminShellProps) {
  return (
    <main className="container">
      <section className="hero-shell">
        <div className="hero-shell-top">
          <div className="hero-shell-heading">
            <div className="hero-badge">Humor Flavor Admin</div>
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{description}</p>
          </div>

          <div className="hero-actions">
            <ThemeToggle />
          </div>
        </div>

        {stats && stats.length > 0 ? (
          <div className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="hero-stat-label">{stat.label}</div>
                <div className="hero-stat-value">{stat.value}</div>
                {stat.meta ? <div className="hero-stat-meta">{stat.meta}</div> : null}
              </div>
            ))}
          </div>
        ) : null}

        <nav className="nav-row" aria-label="Admin navigation">
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