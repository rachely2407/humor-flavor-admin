"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function DuplicateFlavorButton({ flavorId }: { flavorId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDuplicate() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setLoading(false);
      alert("You must be logged in.");
      return;
    }

    const response = await fetch(`/api/admin/flavors/${flavorId}/duplicate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      alert(result.error || "Failed to duplicate humor flavor.");
      return;
    }

    alert(`Duplicated as "${result.slug}".`);
    router.refresh();
  }

  return (
    <button className="btn" type="button" onClick={handleDuplicate} disabled={loading}>
      {loading ? "Duplicating..." : "Duplicate"}
    </button>
  );
}
