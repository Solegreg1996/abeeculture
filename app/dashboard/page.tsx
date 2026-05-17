"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { getWeather } from "@/lib/weather";
import { ActiveFlower, calculateFlowerScore } from "@/lib/flowers";
import { getFloralZone, getFloralZoneLabel } from "@/lib/floralZones";

type Apiary = {
  id: string;
  name: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  environment: string | null;
  hive_count: number | null;
  colony_strength: string | null;
};

type Weather = {
  temperature: number;
  windSpeed: number;
};

function translateColonyStrength(value: string | null) {
  if (value === "strong") return "forte";
  if (value === "medium") return "moyenne";
  if (value === "weak") return "faible";
  return "non renseignée";
}

function getRiskLabel(score: number | null) {
  if (score === null) return "Chargement";
  if (score >= 70) return "Risque élevé";
  if (score >= 45) return "Risque moyen";
  return "Risque faible";
}

function getNectarLabel(score: number | null) {
  if (score === null) return "Chargement";
  if (score >= 70) return "Forte";
  if (score >= 45) return "Moyenne";
  return "Faible";
}

export default function DashboardPage() {
  const supabase = createClient();

  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [selectedApiary, setSelectedApiary] = useState<Apiary | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [message, setMessage] = useState("");
  const [activeFlowers, setActiveFlowers] = useState<ActiveFlower[]>([]);
  const [floralZone, setFloralZone] = useState("France");

  useEffect(() => {
    async function loadApiaries() {
      const { data, error } = await supabase
        .from("apiaries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setMessage("Impossible de charger vos ruchers.");
        return;
      }

      setApiaries(data || []);
      setSelectedApiary(data?.[0] || null);
    }

    loadApiaries();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      if (!selectedApiary?.latitude || !selectedApiary?.longitude) return;

      try {
        const weatherData = await getWeather(
          selectedApiary.latitude,
          selectedApiary.longitude
        );

        setWeather(weatherData);
      } catch (error) {
        console.error(error);
        setMessage("Impossible de récupérer la météo du rucher.");
      }
    }

    loadWeather();
  }, [selectedApiary]);

  useEffect(() => {
    async function loadActiveFlowers() {
      if (!selectedApiary) return;

      const currentMonth = new Date().getMonth() + 1;
      const zone = getFloralZone(
        selectedApiary.latitude,
        selectedApiary.longitude
      );

      setFloralZone(zone);

      const { data, error } = await supabase
        .from("regional_flowering_calendar")
        .select(
          `
          start_month,
          end_month,
          peak_month,
          flowers (
            name,
            slug,
            nectar_value,
            pollen_value,
            bee_interest,
            flowering_intensity
          )
        `
        )
        .eq("region", zone)
        .lte("start_month", currentMonth)
        .gte("end_month", currentMonth);

      if (error) {
        console.error(error);
        setMessage("Impossible de charger les floraisons actives.");
        return;
      }

      const formattedFlowers =
        data?.map((item: any) => ({
          name: item.flowers.name,
          slug: item.flowers.slug,
          nectar_value: item.flowers.nectar_value,
          pollen_value: item.flowers.pollen_value,
          bee_interest: item.flowers.bee_interest,
          flowering_intensity: item.flowers.flowering_intensity,
          start_month: item.start_month,
          end_month: item.end_month,
          peak_month: item.peak_month,
        })) || [];

      setActiveFlowers(formattedFlowers);
    }

    loadActiveFlowers();
  }, [selectedApiary]);

  const swarmingScore =
    weather && selectedApiary
      ? Math.min(
          100,
          Math.round(
            (weather.temperature > 18 ? 30 : 10) +
              (weather.windSpeed < 20 ? 20 : 5) +
              (selectedApiary.colony_strength === "strong" ? 30 : 15)
          )
        )
      : null;

  const nectarScore =
    weather && selectedApiary
      ? Math.min(
          100,
          Math.round(
            (weather.temperature >= 18 && weather.temperature <= 30 ? 45 : 20) +
              (weather.windSpeed < 20 ? 25 : 5) +
              Math.min(activeFlowers.length * 5, 30)
          )
        )
      : null;

  return (
    <main className="min-h-screen bg-[#FFF8E7] text-[#1F1A12]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B47A00]">
              Tableau de bord
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Suivi localisé de vos ruchers
            </h1>
            <p className="mt-3 max-w-2xl text-[#5F5443]">
              Visualisez les conditions météo, les floraisons actives, la
              nectarification et les risques d’essaimage par emplacement.
            </p>
          </div>

          <a
            href="/dashboard/apiaries"
            className="rounded-full bg-[#1F1A12] px-6 py-4 text-sm font-semibold text-white"
          >
            Gérer mes ruchers
          </a>
        </header>

        {message && (
          <p className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold text-red-700">
            {message}
          </p>
        )}

        {apiaries.length > 0 && (
          <div className="mt-8">
            <label className="text-sm font-bold text-[#8A5A00]">
              Rucher sélectionné
            </label>
            <select
              value={selectedApiary?.id || ""}
              onChange={(event) => {
                const apiary = apiaries.find(
                  (item) => item.id === event.target.value
                );
                setSelectedApiary(apiary || null);
                setWeather(null);
                setActiveFlowers([]);
              }}
              className="mt-2 w-full rounded-2xl border border-[#E8D49C] bg-white px-5 py-4 outline-none md:max-w-md"
            >
              {apiaries.map((apiary) => (
                <option key={apiary.id} value={apiary.id}>
                  {apiary.name} — {apiary.city}
                </option>
              ))}
            </select>
          </div>
        )}

        {!selectedApiary && (
          <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black">Aucun rucher enregistré</h2>
            <p className="mt-3 text-[#5F5443]">
              Ajoutez votre premier rucher pour afficher la météo, les
              floraisons et les premiers scores apicoles.
            </p>
            <a
              href="/dashboard/apiaries"
              className="mt-6 inline-flex rounded-full bg-[#1F1A12] px-6 py-4 text-sm font-semibold text-white"
            >
              Ajouter un rucher
            </a>
          </section>
        )}

        {selectedApiary && (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#8A5A00]">Rucher</p>
                <h2 className="mt-2 text-2xl font-black">
                  {selectedApiary.name}
                </h2>
                <p className="mt-2 text-sm text-[#5F5443]">
                  {selectedApiary.hive_count || 1} ruches · colonie{" "}
                  {translateColonyStrength(selectedApiary.colony_strength)}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#8A5A00]">
                  Zone florale
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  {getFloralZoneLabel(floralZone)}
                </h2>
                <p className="mt-2 text-sm text-[#5F5443]">
                  {activeFlowers.length} fleur
                  {activeFlowers.length > 1 ? "s" : ""} active
                  {activeFlowers.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#8A5A00]">Météo</p>
                <h2 className="mt-2 text-2xl font-black">
                  {weather ? `${Math.round(weather.temperature)}°C` : "—"}
                </h2>
                <p className="mt-2 text-sm text-[#5F5443]">
                  {weather
                    ? `Vent ${Math.round(weather.windSpeed)} km/h`
                    : "Chargement"}
                </p>
              </div>

              <div className="rounded-3xl bg-[#1F1A12] p-6 text-white shadow-sm">
                <p className="text-sm font-semibold text-[#F7D774]">
                  Essaimage
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  {getRiskLabel(swarmingScore)}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Score estimé : {swarmingScore ?? "—"}/100
                </p>
              </div>
            </section>

            <section className="mt-5 grid gap-5 md:grid-cols-1">
              <div className="rounded-3xl bg-[#F2B705] p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#5F3B00]">
                  Nectarification
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {getNectarLabel(nectarScore)}
                </h2>
                <p className="mt-2 text-sm text-[#5F3B00]">
                  Score estimé : {nectarScore ?? "—"}/100 · calculé selon
                  météo, vent et nombre de fleurs actives.
                </p>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-7 shadow-sm lg:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B47A00]">
                  Floraisons locales
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">
                  Fleurs actives — {getFloralZoneLabel(floralZone)}
                </h2>
                <p className="mt-3 text-sm text-[#5F5443]">
                  La liste s’adapte automatiquement à la zone florale du rucher
                  et au mois actuel.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {activeFlowers.length === 0 && (
                    <p className="rounded-2xl bg-[#FFF8E7] p-5 text-sm font-semibold text-[#5F5443] md:col-span-3">
                      Aucune floraison active trouvée pour ce mois-ci dans cette
                      zone.
                    </p>
                  )}

                  {activeFlowers.map((flower) => {
                    const score = calculateFlowerScore(
                      flower,
                      new Date().getMonth() + 1,
                      weather?.temperature,
                      weather?.windSpeed
                    );

                    const status =
                      flower.peak_month === new Date().getMonth() + 1
                        ? "Pic de floraison"
                        : "Floraison active";

                    return (
                      <div
                        key={flower.slug}
                        className="rounded-3xl border border-[#F1E3B8] bg-[#FFF8E7] p-5"
                      >
                        <p className="text-xl font-black">{flower.name}</p>
                        <p className="mt-2 text-sm text-[#5F5443]">{status}</p>

                        <div className="mt-4 h-2 rounded-full bg-white">
                          <div
                            className="h-2 rounded-full bg-[#F2B705]"
                            style={{ width: `${score}%` }}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#8A5A00]">
                            Nectar {flower.nectar_value ?? "—"}/5
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#8A5A00]">
                            Score {score}/100
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#1F1A12] p-7 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F7D774]">
                  Recommandations
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em]">
                  Actions utiles
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="font-bold">Inspecter le rucher</p>
                    <p className="mt-1 text-sm text-white/70">
                      À privilégier si la météo est stable et le vent modéré.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="font-bold">Surveiller l’essaimage</p>
                    <p className="mt-1 text-sm text-white/70">
                      Le score évolue selon météo, saison et force de colonie.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="font-bold">Suivre les floraisons</p>
                    <p className="mt-1 text-sm text-white/70">
                      Les fleurs affichées changent selon la zone et la saison.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}