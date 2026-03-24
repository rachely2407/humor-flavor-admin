"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { supabase } from "@/lib/supabaseClient";

type ImageRow = {
  id: string;
  url: string | null;
  image_description: string | null;
  is_public: boolean | null;
};

export default function AdminImagesPageClientWrapper() {
  return <AdminImagesPageInner />;
}

function AdminImagesPageInner() {
  const router = useRouter();

  const [images, setImages] = useState<ImageRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const [url, setUrl] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);

  const filteredImages = useMemo(() => images.slice(0, 100), [images]);

  async function loadImages() {
    setLoadingTable(true);

    const { data, error } = await supabase
      .from("images")
      .select("id, url, image_description, is_public")
      .order("created_datetime_utc", { ascending: false })
      .limit(100);

    setLoadingTable(false);

    if (error) {
      alert(error.message);
      return;
    }

    setImages(data ?? []);
    setLoaded(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setCreating(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch("/api/admin/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        url,
        image_description: imageDescription,
        is_public: isPublic,
      }),
    });

    const result = await response.json();
    setCreating(false);

    if (!response.ok) {
      alert(result.error || "Failed to create image.");
      return;
    }

    alert("Image created successfully");
    setUrl("");
    setImageDescription("");
    setIsPublic(false);
    await loadImages();
    router.refresh();
  }

  return (
    <AdminShell
      title="Images"
      current="images"
      description="Create, browse, and manage image records."
    >
      <section
        style={{
          padding: 28,
          borderRadius: 28,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: 24,
              lineHeight: 1.15,
              color: "#172033",
            }}
          >
            Create image
          </h2>
          <p
            style={{
              margin: 0,
              color: "#63708a",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Add a new image row directly to the images table.
          </p>
        </div>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#2e3a56",
              }}
            >
              Image URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              style={{
                width: "100%",
                border: "1px solid rgba(80,98,140,0.16)",
                background: "rgba(255,255,255,0.95)",
                color: "#172033",
                borderRadius: 16,
                padding: "14px 16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#2e3a56",
              }}
            >
              Image description
            </label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Optional description"
              style={{
                width: "100%",
                minHeight: 140,
                resize: "vertical",
                border: "1px solid rgba(80,98,140,0.16)",
                background: "rgba(255,255,255,0.95)",
                color: "#172033",
                borderRadius: 16,
                padding: "14px 16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                color: "#32405e",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Public image</span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={creating}
              style={{
                minHeight: 46,
                padding: "0 18px",
                borderRadius: 999,
                border: "none",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                background: "linear-gradient(135deg, #5b6df6, #7c5cff)",
                boxShadow: "0 14px 30px rgba(91,109,246,0.22)",
              }}
            >
              {creating ? "Creating..." : "Create image"}
            </button>

            <button
              type="button"
              onClick={loadImages}
              disabled={loadingTable}
              style={{
                minHeight: 46,
                padding: "0 18px",
                borderRadius: 999,
                border: "1px solid rgba(80,98,140,0.14)",
                background: "rgba(255,255,255,0.78)",
                color: "#24314d",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loadingTable
                ? "Loading..."
                : loaded
                ? "Refresh list"
                : "Load images"}
            </button>
          </div>
        </form>
      </section>

      <section
        style={{
          padding: 28,
          borderRadius: 28,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "0 18px 50px rgba(73, 98, 146, 0.12)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: 24,
              lineHeight: 1.15,
              color: "#172033",
            }}
          >
            Recent images
          </h2>
          <p
            style={{
              margin: 0,
              color: "#63708a",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Review the latest image rows and click into any one to edit it.
          </p>
        </div>

        {!loaded ? (
          <div
            style={{
              padding: 30,
              borderRadius: 22,
              border: "1px dashed rgba(80,98,140,0.28)",
              background: "rgba(255,255,255,0.45)",
              color: "#63708a",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0 }}>
              Click “Load images” to view the latest 100 image rows.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {filteredImages.map((image) => (
              <article
                key={image.id}
                style={{
                  overflow: "hidden",
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(80,98,140,0.14)",
                  boxShadow: "0 10px 24px rgba(64, 89, 145, 0.08)",
                }}
              >
                <div style={{ padding: "14px 14px 0" }}>
                  {image.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.url}
                      alt={image.image_description ?? "Image preview"}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: 18,
                        background: "rgba(223,231,255,0.8)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 18,
                        background: "rgba(223,231,255,0.8)",
                        color: "#63708a",
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px 16px 18px" }}>
                  <div style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "rgba(91,109,246,0.09)",
                        border: "1px solid rgba(91,109,246,0.12)",
                        color: "#4353c7",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {image.is_public ? "Public" : "Private"}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: 18,
                      lineHeight: 1.25,
                      color: "#172033",
                    }}
                  >
                    {image.image_description?.trim() || "Untitled image"}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#55627d",
                      fontSize: 12,
                      lineHeight: 1.5,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {image.id}
                  </p>

                  <p
                    style={{
                      margin: "0 0 14px 0",
                      color: "#63708a",
                      fontSize: 13,
                      lineHeight: 1.6,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {image.url ?? "No URL"}
                  </p>

                  <div>
                    <Link
                      href={`/admin/images/${image.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 42,
                        padding: "0 16px",
                        borderRadius: 999,
                        textDecoration: "none",
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #5b6df6, #7c5cff)",
                        boxShadow: "0 14px 30px rgba(91,109,246,0.18)",
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}