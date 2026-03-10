"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function FlavorEditor({
  flavor,
}: {
  flavor: {
    id: number;
    slug: string | null;
    description: string | null;
  };
}) {
  const router = useRouter();

  const [slug, setSlug] = useState(flavor.slug ?? "");
  const [description, setDescription] = useState(flavor.description ?? "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("humor_flavors")
      .update({
        slug,
        description,
      })
      .eq("id", flavor.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Humor flavor updated successfully");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this humor flavor?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from("humor_flavors")
      .delete()
      .eq("id", flavor.id);

    setDeleting(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Humor flavor deleted successfully");
    router.push("/admin/flavors");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="card"
      style={{ padding: 24, maxWidth: 700 }}
    >
      <div style={{ marginBottom: 16 }}>
        <label className="label">Slug</label>
        <input
          className="input"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="label">Description</label>
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => router.push("/admin/flavors")}
        >
          Back
        </button>

        <button
          type="button"
          className="btn btn-danger"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete flavor"}
        </button>
      </div>
    </form>
  );
}