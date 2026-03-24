import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { ImageEditor } from "@/components/image-editor";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMatrixOrSuperadmin();

  const { id } = await params;
  const imageId = id;

  if (!imageId) {
    notFound();
  }

  const admin = supabaseAdmin();

  const { data: image, error } = await admin
    .from("images")
    .select("id, url, image_description, is_public")
    .eq("id", imageId)
    .single();

  if (error || !image) {
    notFound();
  }

  return (
    <AdminShell
      title={`Edit Image`}
      current="images"
      description="Update image metadata and visibility."
    >
      <ImageEditor image={image} />
    </AdminShell>
  );
}