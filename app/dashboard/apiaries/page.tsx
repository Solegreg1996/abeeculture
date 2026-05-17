"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { geocodeCity } from "@/lib/geocoding";

type Apiary = {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    environment: string | null;
    hive_count: number | null;
    colony_strength: string | null;
};

export default function ApiariesPage() {
    const supabase = createClient();

    const [apiaries, setApiaries] = useState<Apiary[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        city: "",
        country: "France",
        hive_count: 1,
        environment: "",
        colony_strength: "medium",
    });

    async function loadApiaries() {
        const { data, error } = await supabase
            .from("apiaries")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setMessage("Impossible de charger les ruchers.");
            return;
        }

        setApiaries(data || []);
    }

    useEffect(() => {
        loadApiaries();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("loading");
        setMessage("");

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setStatus("error");
            setMessage("Vous devez être connecté pour ajouter un rucher.");
            return;
        }

        let coordinates = {
            latitude: null as number | null,
            longitude: null as number | null,
        };

        try {
            coordinates = await geocodeCity(form.city, form.country);
        } catch (error) {
            console.error(error);
        }

        const { error } = await supabase.from("apiaries").insert({
            user_id: user.id,
            name: form.name,
            city: form.city,
            country: form.country,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            hive_count: form.hive_count,
            environment: form.environment,
            colony_strength: form.colony_strength,
        });

        if (error) {
            console.error(error);
            setStatus("error");
            setMessage(error.message);
            return;
        }

        setStatus("success");
        setMessage("Rucher ajouté avec succès.");

        setForm({
            name: "",
            city: "",
            country: "France",
            hive_count: 1,
            environment: "",
            colony_strength: "medium",
        });

        await loadApiaries();
    }

    return (
        <main className="min-h-screen bg-[#FFF8E7] px-6 py-10 text-[#1F1A12]">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B47A00]">
                            Gestion des ruchers
                        </p>

                        <h1 className="mt-3 text-5xl font-black tracking-[-0.05em]">
                            Mes ruchers
                        </h1>

                        <p className="mt-3 max-w-2xl text-[#5F5443]">
                            Ajoutez plusieurs ruchers pour obtenir des alertes météo,
                            florales et apicoles spécifiques à chaque localisation.
                        </p>
                    </div>

                    <a
                        href="/dashboard"
                        className="rounded-full bg-[#1F1A12] px-6 py-4 text-sm font-semibold text-white"
                    >
                        Retour dashboard
                    </a>
                </div>

                <section className="mt-10 grid gap-8 lg:grid-cols-3">
                    <div className="rounded-[2rem] bg-white p-7 shadow-sm lg:col-span-1">
                        <h2 className="text-2xl font-black tracking-[-0.03em]">
                            Ajouter un rucher
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Nom du rucher"
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            />

                            <input
                                required
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                placeholder="Ville"
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            />

                            <input
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                placeholder="Pays"
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            />


                            <input
                                type="number"
                                min="1"
                                value={form.hive_count}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        hive_count: Number(e.target.value),
                                    })
                                }
                                placeholder="Nombre de ruches"
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            />

                            <input
                                value={form.environment}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        environment: e.target.value,
                                    })
                                }
                                placeholder="Environnement : forêt, montagne, garrigue..."
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            />

                            <select
                                value={form.colony_strength}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        colony_strength: e.target.value,
                                    })
                                }
                                className="w-full rounded-2xl border border-[#E8D49C] px-5 py-4 outline-none"
                            >
                                <option value="weak">Colonie faible</option>
                                <option value="medium">Colonie moyenne</option>
                                <option value="strong">Colonie forte</option>
                            </select>

                            <button
                                type="submit"
                                className="w-full rounded-full bg-[#1F1A12] px-6 py-4 font-semibold text-white"
                            >
                                {status === "loading" ? "Ajout..." : "Ajouter le rucher"}
                            </button>

                            {message && (
                                <p
                                    className={`text-sm font-semibold ${status === "error" ? "text-red-700" : "text-green-700"
                                        }`}
                                >
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>

                    <div className="space-y-5 lg:col-span-2">
                        {apiaries.length === 0 && (
                            <div className="rounded-[2rem] bg-white p-7 text-[#5F5443] shadow-sm">
                                Aucun rucher enregistré pour le moment.
                            </div>
                        )}

                        {apiaries.map((apiary) => (
                            <div key={apiary.id} className="rounded-[2rem] bg-white p-7 shadow-sm">
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B47A00]">
                                            {apiary.city || "Localisation non renseignée"}
                                        </p>

                                        <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">
                                            {apiary.name}
                                        </h2>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <span className="rounded-full bg-[#FFF8E7] px-4 py-2 text-sm font-semibold">
                                                {apiary.hive_count || 1} ruches
                                            </span>

                                            {apiary.environment && (
                                                <span className="rounded-full bg-[#FFF8E7] px-4 py-2 text-sm font-semibold">
                                                    {apiary.environment}
                                                </span>
                                            )}

                                            <span className="rounded-full bg-[#F2B705] px-4 py-2 text-sm font-bold text-[#1F1A12]">
                                                Colonie {apiary.colony_strength}
                                            </span>
                                        </div>

                                        {(apiary.latitude || apiary.longitude) && (
                                            <p className="mt-4 text-sm text-[#5F5443]">
                                                Coordonnées : {apiary.latitude}, {apiary.longitude}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-2xl bg-[#1F1A12] px-5 py-4 text-white">
                                        <p className="text-sm text-[#F7D774]">Statut</p>
                                        <p className="mt-1 text-2xl font-black">Actif</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}