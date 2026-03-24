"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadImageFile } from "@/lib/imageUpload";

type Flavor = {
  id: number;
  slug: string | null;
  description: string | null;
};

type CaptionResult = {
  id?: string;
  content?: string;
  humor_flavor_id?: number;
  caption_request_id?: number;
  llm_prompt_chain_id?: number;
  created_datetime_utc?: string;
  image_id?: string;
};

export function CaptionTestingPanel({ flavors }: { flavors: Flavor[] }) {
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedFlavor = useMemo(
    () => flavors.find((f) => String(f.id) === selectedFlavorId),
    [flavors, selectedFlavorId]
  );

  function handleFileChange(file: File | null) {
    setImage(file);
    setResult(null);
    setErrorMessage("");

    if (!file) {
      setPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
  }

  function handleRemoveImage() {
    setImage(null);
    setPreviewUrl("");
    setImageUrl("");
    setResult(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleGenerate() {
    if (!selectedFlavorId || !image) {
      alert("Please choose a humor flavor and upload an image.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No active Supabase session found. Please log in again.");
      }

      const cdnUrl = await uploadImageFile(image, token);

      const registerRes = await fetch(
        "https://api.almostcrackd.ai/pipeline/upload-image-from-url",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: cdnUrl,
            isCommonUse: false,
          }),
        }
      );

      if (!registerRes.ok) {
        const text = await registerRes.text();
        throw new Error(`Failed to register uploaded image: ${text}`);
      }

      const registerData = await registerRes.json();
      setImageUrl(cdnUrl);

      const captionRes = await fetch(
        "https://api.almostcrackd.ai/pipeline/generate-captions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageId: registerData.imageId,
            humorFlavorId: Number(selectedFlavorId),
          }),
        }
      );

      if (!captionRes.ok) {
        const text = await captionRes.text();
        throw new Error(`Failed to generate captions: ${text}`);
      }

      const captionData = await captionRes.json();
      setResult(Array.isArray(captionData) ? captionData : [captionData]);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Caption generation failed.";
      setErrorMessage(message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 20,
        gridTemplateColumns: "minmax(320px, 430px) minmax(420px, 1fr)",
      }}
    >
      <section className="card" style={{ padding: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 0,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 900,
            border: "2px solid #111111",
            background: "#f4c300",
            color: "#111111",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 14,
          }}
        >
          API Test Runner
        </div>

        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: "1.6rem", textTransform: "uppercase" }}>
          Test a Humor Flavor
        </h2>

        <p style={{ marginTop: 0, opacity: 0.8, lineHeight: 1.7 }}>
          Upload one image, choose a flavor, and run the Crackd caption pipeline
          for that specific humor flavor.
        </p>

        <div style={{ marginTop: 18 }}>
          <label className="label">Humor flavor</label>
          <select
            className="select"
            value={selectedFlavorId}
            onChange={(e) => setSelectedFlavorId(e.target.value)}
          >
            <option value="">Choose a flavor</option>
            {flavors.map((flavor) => (
              <option key={flavor.id} value={flavor.id}>
                {flavor.id} — {flavor.slug ?? "(no slug)"}
              </option>
            ))}
          </select>
        </div>

        {selectedFlavor && (
          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 0,
              border: "2px solid #111111",
              background: "#fffdf7",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {selectedFlavor.slug ?? `Flavor ${selectedFlavor.id}`}
            </div>
            <div style={{ opacity: 0.78, lineHeight: 1.6 }}>
              {selectedFlavor.description || "No description."}
            </div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <label className="label">Upload image</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: 0,
                padding: "10px 16px",
                fontWeight: 900,
              }}
            >
              Choose file
            </button>

            {image && (
              <button
                type="button"
                className="btn"
                onClick={handleRemoveImage}
                style={{
                  borderRadius: 0,
                  padding: "10px 16px",
                  fontWeight: 900,
                  background: "#111111",
                  color: "#fff8ea",
                  border: "3px solid #111111",
                }}
              >
                Remove image
              </button>
            )}

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 0,
                border: "2px solid #111111",
                background: "#fffdf7",
                minHeight: 42,
                display: "inline-flex",
                alignItems: "center",
                opacity: image ? 1 : 0.75,
              }}
            >
              {image ? image.name : "No file chosen"}
            </div>
          </div>
        </div>

        {previewUrl && (
          <div style={{ marginTop: 18 }}>
            <div className="label">Preview</div>
            <img
              src={previewUrl}
              alt="Upload preview"
              style={{
                width: "100%",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 8,
                border: "3px solid #111111",
                boxShadow: "var(--shadow-soft)",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate captions"}
          </button>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 0,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 900,
            border: "2px solid #111111",
            background: "#0f62fe",
            color: "#fff8ea",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 14,
          }}
        >
          Results
        </div>

        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: "1.6rem", textTransform: "uppercase" }}>
          Generated Captions
        </h2>

        <p style={{ marginTop: 0, opacity: 0.8, lineHeight: 1.7 }}>
          Cleanly formatted captions and request metadata will appear here after the
          pipeline finishes.
        </p>

        {errorMessage ? (
          <div
            style={{
              marginTop: 20,
              minHeight: 220,
              borderRadius: 8,
              border: "3px solid #111111",
              background: "#d92d20",
              color: "#fff8ea",
              padding: 20,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Generation failed</div>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {errorMessage}
            </pre>
          </div>
        ) : !result ? (
          <div
            style={{
              marginTop: 20,
              minHeight: 360,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              border: "3px dashed #111111",
              background: "#fffdf7",
              textAlign: "center",
              padding: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 42, marginBottom: 10 }}>□</div>
              <div style={{ fontWeight: 900, marginBottom: 6, textTransform: "uppercase" }}>No output yet</div>
              <div style={{ opacity: 0.75 }}>
                Run a test and the generated caption cards will appear here.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
            {result.map((item, index) => (
              <article
                key={item.id ?? index}
                style={{
                  borderRadius: 8,
                  border: "3px solid #111111",
                  background: "#fffaf0",
                  padding: 18,
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Generated caption image"
                    style={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginBottom: 14,
                      border: "3px solid #111111",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderRadius: 0,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 900,
                      border: "2px solid #111111",
                      background: "#f4c300",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Caption {index + 1}
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.72 }}>
                    {item.created_datetime_utc
                      ? new Date(item.created_datetime_utc).toLocaleString()
                      : "No timestamp"}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1.02rem",
                    lineHeight: 1.75,
                    fontWeight: 500,
                    marginBottom: 16,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content || "No caption text returned."}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      borderRadius: 0,
                      padding: "10px 12px",
                      border: "2px solid #111111",
                      background: "#fffdf7",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      Flavor ID
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.humor_flavor_id ?? "—"}</div>
                  </div>

                  <div
                    style={{
                      borderRadius: 0,
                      padding: "10px 12px",
                      border: "2px solid #111111",
                      background: "#fffdf7",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      Caption Request ID
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.caption_request_id ?? "—"}</div>
                  </div>

                  <div
                    style={{
                      borderRadius: 0,
                      padding: "10px 12px",
                      border: "2px solid #111111",
                      background: "#fffdf7",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                      Prompt Chain ID
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.llm_prompt_chain_id ?? "—"}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
