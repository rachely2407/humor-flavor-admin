import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { FlavorEditor } from "@/components/flavor-editor";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function FlavorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireMatrixOrSuperadmin();

  const { id } = await params;
  const admin = supabaseAdmin();

  const { data: flavor, error } = await admin
    .from("humor_flavors")
    .select("id, slug, description")
    .eq("id", Number(id))
    .single();

  if (error || !flavor) {
    notFound();
  }

  return (
    <AdminShell title={`Edit Flavor #${flavor.id}`}>
      <FlavorEditor flavor={flavor} />
    </AdminShell>
  );
}