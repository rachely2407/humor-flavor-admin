import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";

export default function AdminHomePage() {
  return (
    <AdminShell
      title="Dashboard"
      current="dashboard"
      description="Professional control center for humor flavors, prompt-chain steps, and caption testing."
    >
      <div className="dashboard-grid">
        <Link href="/admin/flavors" className="dashboard-card span-4">
          <div className="badge">Catalog</div>
          <h2>Humor Flavors</h2>
          <p>Create, edit, and delete humor flavor definitions.</p>
          <div className="metric">Manage</div>
        </Link>

        <Link href="/admin/steps" className="dashboard-card span-4">
          <div className="badge">Workflow</div>
          <h2>Flavor Steps</h2>
          <p>Update prompt-chain steps, reorder them, and control logic.</p>
          <div className="metric">Edit</div>
        </Link>

        <Link href="/admin/testing" className="dashboard-card span-4">
          <div className="badge">Testing</div>
          <h2>Caption Testing</h2>
          <p>Generate captions from your image test set using a humor flavor.</p>
          <div className="metric">Run</div>
        </Link>
      </div>
    </AdminShell>
  );
}