import { AdminShell } from "@/components/admin-shell";
import { CaptionTestingPanel } from "@/components/caption-testing-panel";
import { requireMatrixOrSuperadmin } from "@/lib/requireMatrixOrSuperadmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function CaptionTestingPage() {
  await requireMatrixOrSuperadmin();

  const admin = supabaseAdmin();

  const { data: flavors, error } = await admin
    .from("humor_flavors")
    .select("id, slug, description")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminShell title="Caption Testing">
      <CaptionTestingPanel flavors={flavors ?? []} />
    </AdminShell>
  );
}