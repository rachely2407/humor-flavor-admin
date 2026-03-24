"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { supabase } from "@/lib/supabaseClient";
import { uploadImageFile } from "@/lib/imageUpload";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    let uploadedUrl = url.trim();

    try {
      if (selectedFile) {
        uploadedUrl = await uploadImageFile(selectedFile, session.access_token);
      }
    } catch (error) {
      setCreating(false);
      alert(error instanceof Error ? error.message : "Failed to upload image.");
      return;
    }

    const response = await fetch("/api/admin/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        url: uploadedUrl,
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
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          borderRadius: 8,
          background: "#fff8ea",
          border: "3px solid #111111",
          boxShadow: "10px 10px 0 rgba(17,17,17,0.96)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: 24,
              lineHeight: 1.15,
              color: "#111111",
              textTransform: "uppercase",
            }}
          >
            Create image
          </h2>
          <p
            style={{
              margin: 0,
              color: "#545454",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Upload a new file or save an existing image URL into the images table.
          </p>
        </div>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 900,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Image file
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#545454",
                lineHeight: 1.6,
                fontSize: 13,
              }}
            >
              {selectedFile
                ? `Selected file: ${selectedFile.name}`
                : "Optional. If a file is selected, its uploaded CDN URL will be saved automatically."}
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 900,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Image URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required={!selectedFile}
              style={{
                width: "100%",
                border: "3px solid #111111",
                background: "#fffdf7",
                color: "#111111",
                borderRadius: 0,
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
                fontWeight: 900,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
                border: "3px solid #111111",
                background: "#fffdf7",
                color: "#111111",
                borderRadius: 0,
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
                color: "#111111",
                fontWeight: 800,
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
                borderRadius: 0,
                border: "3px solid #111111",
                color: "#fff8ea",
                fontWeight: 900,
                cursor: "pointer",
                background: "#d92d20",
                boxShadow: "6px 6px 0 rgba(17,17,17,0.96)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
                borderRadius: 0,
                border: "3px solid #111111",
                background: "#0f62fe",
                color: "#fff8ea",
                fontWeight: 900,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
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
          borderRadius: 8,
          background: "#fffdf7",
          border: "3px solid #111111",
          boxShadow: "10px 10px 0 rgba(15,98,254,0.88)",
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: 24,
              lineHeight: 1.15,
              color: "#111111",
              textTransform: "uppercase",
            }}
          >
            Recent images
          </h2>
          <p
            style={{
              margin: 0,
              color: "#545454",
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
              borderRadius: 8,
              border: "3px dashed #111111",
              background: "#fff8ea",
              color: "#545454",
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
                  borderRadius: 8,
                  background: "#fffaf0",
                  border: "3px solid #111111",
                  boxShadow: "6px 6px 0 rgba(17,17,17,0.24)",
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
                        borderRadius: 8,
                        background: "rgba(15,98,254,0.12)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 8,
                        background: "rgba(15,98,254,0.12)",
                        color: "#545454",
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
                        borderRadius: 0,
                        background: image.is_public ? "#f4c300" : "#111111",
                        border: "2px solid #111111",
                        color: image.is_public ? "#111111" : "#fff8ea",
                        fontSize: 12,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
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
                      color: "#111111",
                      textTransform: "uppercase",
                    }}
                  >
                    {image.image_description?.trim() || "Untitled image"}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 8px 0",
                      color: "#545454",
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
                      color: "#545454",
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
                        borderRadius: 0,
                        textDecoration: "none",
                        border: "3px solid #111111",
                        color: "#fff8ea",
                        fontWeight: 900,
                        background: "#0f62fe",
                        boxShadow: "6px 6px 0 rgba(17,17,17,0.96)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
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
