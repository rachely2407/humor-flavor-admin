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
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const token = await getAccessToken();

    if (!token) {
      setLoading(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/flavors/${flavor.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug,
        description,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error || "Failed to update humor flavor.");
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

    const token = await getAccessToken();

    if (!token) {
      setDeleting(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/flavors/${flavor.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    setDeleting(false);

    if (!response.ok) {
      alert(result.error || "Failed to delete humor flavor.");
      return;
    }

    alert("Humor flavor deleted successfully");
    router.push("/admin/flavors");
    router.refresh();
  }

  async function handleDuplicate() {
    setDuplicating(true);

    const token = await getAccessToken();

    if (!token) {
      setDuplicating(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/flavors/${flavor.id}/duplicate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    setDuplicating(false);

    if (!response.ok) {
      alert(result.error || "Failed to duplicate humor flavor.");
      return;
    }

    alert(`Humor flavor duplicated as "${result.slug}".`);
    router.push(`/admin/flavors/${result.id}`);
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
          disabled={duplicating}
          onClick={handleDuplicate}
        >
          {duplicating ? "Duplicating..." : "Duplicate flavor"}
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
