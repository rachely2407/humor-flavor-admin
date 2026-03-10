"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  async function handleGoogleLogin() {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <main
      className="container"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 520, padding: 28 }}>
        <div className="badge" style={{ marginBottom: 12 }}>
          🎀 Matrix Admin Login
        </div>

        <h1 style={{ marginTop: 0, marginBottom: 12 }}>Humor Flavor Admin</h1>

        <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
          Sign in with Google. Access should only work for users whose profile has{" "}
          <code>is_superadmin</code> or <code>is_matrix_admin</code>.
        </p>

        <button
          className="btn btn-primary"
          style={{ marginTop: 16, width: "100%" }}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}