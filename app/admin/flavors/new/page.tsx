"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "@/components/admin-shell";

export default function NewFlavorPage() {
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setLoading(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch("/api/admin/flavors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        slug,
        description,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error || "Failed to create humor flavor.");
      return;
    }

    alert("Humor flavor created successfully");
    router.push("/admin/flavors");
    router.refresh();
  }

  return (
    <AdminShell title="Create Humor Flavor">
      <form
        onSubmit={handleCreate}
        className="card"
        style={{ padding: 24, maxWidth: 700 }}
      >
        <div style={{ marginBottom: 16 }}>
          <label className="label">Slug</label>

          <input
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. sarcastic-genz"
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="label">Description</label>

          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the humor flavor..."
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create flavor"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => router.push("/admin/flavors")}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminShell>
  );
}