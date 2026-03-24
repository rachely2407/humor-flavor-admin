"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "forbidden") {
      setErrorMessage(
        "This account is not authorized. Only superadmins can access this admin panel."
      );
    }

    if (error === "oauth") {
      setErrorMessage("Google login failed. Please try again.");
    }
  }, []);

  async function handleGoogleLogin() {
    setErrorMessage(null);

    await supabase.auth.signOut();

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
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
          Admin Login
        </div>

        <h1 style={{ marginTop: 0, marginBottom: 12 }}>Humor Flavor Admin</h1>

        <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
          Sign in with Google. Access is restricted to accounts whose profile has{" "}
          <code>is_superadmin</code> set to true.
        </p>

        {errorMessage && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              background: "rgba(239,68,68,0.12)",
              color: "#dc2626",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </div>
        )}

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