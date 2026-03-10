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

    const { error } = await supabase
      .from("humor_flavors")
      .insert({
        slug,
        description,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
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