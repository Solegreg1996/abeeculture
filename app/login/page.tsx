"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const supabase = createClient();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard/apiaries";
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7] px-6 py-12 text-[#1F1A12]">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
        <a href="/" className="text-sm font-bold text-[#B47A00]">
          ← Retour
        </a>

        <h1 className="mt-6 text-4xl font-black tracking-[-0.04em]">
          Connexion
        </h1>

        <p className="mt-3 text-[#5F5443]">
          Connectez-vous à votre espace Abeeculture pour gérer vos ruchers.
        </p>

        <form onSubmit={handleLogin} className="mt-8 grid gap-4">
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <input
            name="password"
            required
            type="password"
            placeholder="Mot de passe"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <button
            type="submit"
            className="rounded-full bg-[#1F1A12] px-7 py-4 font-semibold text-white"
          >
            {status === "loading" ? "Connexion..." : "Se connecter"}
          </button>

          {message && (
            <p className="text-sm font-semibold text-red-700">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}