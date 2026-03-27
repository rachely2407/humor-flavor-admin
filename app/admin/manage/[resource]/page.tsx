import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminResourcePage } from "@/components/admin-resource-page";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { getAdminResourceConfig } from "@/lib/adminResources";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminManageResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  await requireMatrixOrSuperadmin();

  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    notFound();
  }

  const admin = supabaseAdmin();
  const query = admin
    .from(config.table)
    .select("*")
    .order(config.orderBy, { ascending: config.orderAscending ?? false })
    .limit(200);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminShell
      title={config.title}
      current={config.slug}
      description={config.description}
    >
      <AdminResourcePage config={config} initialRows={data ?? []} />
    </AdminShell>
  );
}
