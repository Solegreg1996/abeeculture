"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function SignupPage() {
  const supabase = createClient();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const firstName = String(formData.get("first_name"));
    const lastName = String(formData.get("last_name"));
    const phone = String(formData.get("phone"));
    const city = String(formData.get("city"));
    const emailOptIn = formData.get("email_opt_in") === "on";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      setStatus("error");
      setMessage(error?.message || "Erreur lors de l’inscription.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      email_opt_in: emailOptIn,
    });

    if (profileError) {
      setStatus("error");
      setMessage(profileError.message);
      return;
    }

    setStatus("success");
    setMessage(
      "Compte créé. Vérifiez votre email si une confirmation vous est demandée."
    );

    form.reset();
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7] px-6 py-12 text-[#1F1A12]">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
        <a href="/" className="text-sm font-bold text-[#B47A00]">
          ← Retour
        </a>

        <h1 className="mt-6 text-4xl font-black tracking-[-0.04em]">
          Créer mon compte
        </h1>

        <p className="mt-3 text-[#5F5443]">
          Créez votre espace Abeeculture pour ajouter vos ruchers et recevoir
          des alertes localisées.
        </p>

        <form onSubmit={handleSignup} className="mt-8 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="first_name"
              placeholder="Prénom"
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
            />

            <input
              name="last_name"
              placeholder="Nom"
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
            />
          </div>

          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <input
            name="phone"
            type="tel"
            placeholder="Téléphone"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <input
            name="city"
            placeholder="Ville principale"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <input
            name="password"
            required
            type="password"
            placeholder="Mot de passe"
            className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
          />

          <label className="flex gap-3 text-sm text-[#5F5443]">
            <input name="email_opt_in" type="checkbox" className="mt-1" />
            J’accepte de recevoir les alertes, conseils apicoles et informations
            produit d’Abeeculture.
          </label>

          <button
            type="submit"
            className="rounded-full bg-[#1F1A12] px-7 py-4 font-semibold text-white"
          >
            {status === "loading" ? "Création..." : "Créer mon compte"}
          </button>

          {message && (
            <p
              className={`text-sm font-semibold ${
                status === "error" ? "text-red-700" : "text-green-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}