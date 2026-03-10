import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function requireMatrixOrSuperadmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, is_superadmin, is_matrix_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile || (!profile.is_superadmin && !profile.is_matrix_admin)) {
    redirect("/login?error=forbidden");
  }

  return { user, profile };
}