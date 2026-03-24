"use client";

export async function uploadImageFile(file: File, token: string) {
  const presignedRes = await fetch(
    "https://api.almostcrackd.ai/pipeline/generate-presigned-url",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type,
      }),
    }
  );

  if (!presignedRes.ok) {
    const text = await presignedRes.text();
    throw new Error(`Failed to generate presigned upload URL: ${text}`);
  }

  const presignedData: { presignedUrl: string; cdnUrl: string } =
    await presignedRes.json();

  const uploadRes = await fetch(presignedData.presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload the image to the presigned URL.");
  }

  return presignedData.cdnUrl;
}
