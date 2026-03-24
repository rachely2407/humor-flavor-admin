"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function ImageEditor({
  image,
}: {
  image: {
    id: string;
    url: string | null;
    image_description: string | null;
    is_public: boolean | null;
  };
}) {
  const router = useRouter();

  const [url, setUrl] = useState(image.url ?? "");
  const [imageDescription, setImageDescription] = useState(
    image.image_description ?? ""
  );
  const [isPublic, setIsPublic] = useState(Boolean(image.is_public));
  const [loading, setLoading] = useState(false);
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

    const response = await fetch(`/api/admin/images/${image.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        image_description: imageDescription,
        is_public: isPublic,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.error || "Failed to update image.");
      return;
    }

    alert("Image updated successfully");
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const token = await getAccessToken();

    if (!token) {
      setDeleting(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/images/${image.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    setDeleting(false);

    if (!response.ok) {
      alert(result.error || "Failed to delete image.");
      return;
    }

    alert("Image deleted successfully");
    router.push("/admin/images");
    router.refresh();
  }

  return (
    <div className="admin-stack">
      <div className="hero-card">
        <div className="hero-copy">
          <div className="badge">Image Record</div>
          <h2>Edit image</h2>
          <p>
            Update the image URL, description, and visibility. Changes are saved
            through protected admin routes.
          </p>
        </div>

        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Image preview"
            className="image-preview-large"
          />
        ) : (
          <div className="image-preview-large image-preview-empty">
            No preview
          </div>
        )}
      </div>

      <form onSubmit={handleUpdate} className="pretty-panel form-panel">
        <div className="form-group">
          <label className="label">Image URL</label>
          <input
            className="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Image description</label>
          <textarea
            className="textarea"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            placeholder="Describe what is in the image"
          />
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span>Public image</span>
          </label>
        </div>

        <div className="action-row">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => router.push("/admin/images")}
          >
            Back
          </button>

          <button
            type="button"
            className="btn btn-danger"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete image"}
          </button>
        </div>
      </form>
    </div>
  );
}