"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleEarlyAccessSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setFormStatus("loading");

    const form = event.currentTarget;
const formData = new FormData(form);

    const { error } = await supabase.from("early_access_leads").insert({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      email_opt_in: formData.get("email_opt_in") === "on",
    });

    if (error) {
      console.error(error);
      setFormStatus("error");
      return;
    }

    setFormStatus("success");
    form.reset();
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7] text-[#1F1A12]">
      <section className="relative overflow-hidden px-6 py-8 md:px-12 lg:px-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F2B705] text-xl shadow-sm">
              🐝
            </div>
            <span className="text-xl font-bold tracking-tight">Abeeculture</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features">Fonctionnalités</a>
            <a href="#how">Comment ça marche</a>
            <a href="/signup">Accès anticipé</a>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-[#E8D49C] bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8A5A00] shadow-sm">
              Alertes apicoles localisées
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Anticipez les
              <span className="block text-[#B47A00]">floraisons</span>
              et la nectarification
              <span className="block">de vos ruchers.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-[#5F5443]">
              Abeeculture aide les apiculteurs et passionnés d’abeilles à suivre
              leurs ruchers selon leur localisation, la météo, les fleurs actives
              et les périodes clés de production.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/signup"
                className="rounded-full bg-[#1F1A12] px-7 py-4 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-[#3A3122]"
              >
                Rejoindre l’accès anticipé
              </a>
              <a
                href="#features"
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-[#1F1A12] shadow-sm transition hover:bg-[#FFF1BF]"
              >
                Voir les fonctionnalités
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-2xl">
            <div className="rounded-[1.5rem] bg-[#1F1A12] p-6 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#F7D774]">Rucher sélectionné</p>
                  <h2 className="text-2xl font-bold">Grasse — Collines</h2>
                </div>
                <span className="rounded-full bg-[#F2B705] px-3 py-1 text-sm font-bold text-[#1F1A12]">
                  Actif
                </span>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm text-[#F7D774]">Risque d’essaimage</p>
                  <p className="mt-2 text-3xl font-bold">Élevé</p>
                  <p className="mt-2 text-sm text-white/70">
                    Conditions douces, floraisons actives et colonie forte.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <p className="text-sm text-[#F7D774]">Nectarification</p>
                    <p className="mt-2 text-2xl font-bold">Forte</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <p className="text-sm text-[#F7D774]">Météo</p>
                    <p className="mt-2 text-2xl font-bold">22°C</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F2B705] p-5 text-[#1F1A12]">
                  <p className="text-sm font-semibold">Fleurs actives</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">Acacia</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">Thym</span>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">Romarin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#B47A00]">
            Fonctionnalités MVP
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            Tout est pensé autour de la localisation de vos ruchers.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Ruchers multi-localisations",
                text: "Ajoutez plusieurs ruchers et obtenez des recommandations spécifiques à chaque emplacement.",
              },
              {
                title: "Floraisons locales",
                text: "Visualisez les fleurs actives autour du rucher et indiquez celles qui sont en nectarification.",
              },
              {
                title: "Alertes utiles",
                text: "Recevez des emails lorsque les conditions météo, florales ou saisonnières nécessitent votre attention.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-[#F1E3B8] bg-[#FFF8E7] p-7 shadow-sm"
              >
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-4 leading-7 text-[#5F5443]">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#1F1A12] p-8 text-white md:p-12">
          <h2 className="text-4xl font-bold">Comment ça marche ?</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-[#F2B705]">01</p>
              <h3 className="mt-4 text-xl font-bold">Ajoutez vos ruchers</h3>
              <p className="mt-3 text-white/70">
                Indiquez la ville, les coordonnées, le nombre de ruches et la force estimée des colonies.
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-[#F2B705]">02</p>
              <h3 className="mt-4 text-xl font-bold">Suivez les floraisons</h3>
              <p className="mt-3 text-white/70">
                Abeeculture croise saison, météo et fleurs locales pour estimer la nectarification.
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-[#F2B705]">03</p>
              <h3 className="mt-4 text-xl font-bold">Recevez les alertes</h3>
              <p className="mt-3 text-white/70">
                Vous êtes prévenu quand une action peut être utile : inspection, hausse, vigilance essaimage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Rejoindre l’accès anticipé
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5F5443]">
            La première version d’Abeeculture arrive bientôt. Inscrivez-vous pour tester le produit
            et recevoir les premières alertes apicoles localisées.
          </p>

          <form
            onSubmit={handleEarlyAccessSubmit}
            className="mt-8 grid gap-4 rounded-3xl bg-[#FFF8E7] p-5 shadow-sm md:grid-cols-2"
          >
            <input
              name="first_name"
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
              placeholder="Prénom"
            />
            <input
              name="last_name"
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
              placeholder="Nom"
            />
            <input
              name="email"
              required
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none md:col-span-2"
              placeholder="Adresse email"
              type="email"
            />
            <input
              name="phone"
              className="rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none md:col-span-2"
              placeholder="Téléphone"
              type="tel"
            />
            <label className="flex gap-3 text-left text-sm text-[#5F5443] md:col-span-2">
              <input name="email_opt_in" type="checkbox" className="mt-1" />
              J’accepte de recevoir des emails d’Abeeculture concernant les alertes,
              conseils apicoles et informations produit.
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#1F1A12] px-7 py-4 text-sm font-semibold text-white md:col-span-2"
            >
              {formStatus === "loading" ? "Envoi en cours..." : "Demander mon accès"}
            </button>
            {formStatus === "success" && (
              <p className="text-sm font-semibold text-green-700 md:col-span-2">
                Merci, votre demande d’accès a bien été enregistrée.
              </p>
            )}

            {formStatus === "error" && (
              <p className="text-sm font-semibold text-red-700 md:col-span-2">
                Une erreur est survenue. Vérifiez les champs ou réessayez.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-[#5F5443]">
        © 2026 Abeeculture — Assistant apicole localisé.
      </footer>
    </main>
  );
}