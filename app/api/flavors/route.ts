import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = supabaseAdmin();

  const { data } = await admin
    .from("humor_flavors")
    .select("id, slug")
    .order("slug");

  return Response.json(data);
}