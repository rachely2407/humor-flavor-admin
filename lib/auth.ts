import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function assertAdminByAccessToken(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const admin = supabaseAdmin();

  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(token);

  if (userError || !user) {
    throw new Error("Invalid token");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("is_superadmin, is_matrix_admin")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || (!profile.is_superadmin && !profile.is_matrix_admin)) {
    throw new Error("Forbidden");
  }

  return user;
}