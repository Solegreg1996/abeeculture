export async function geocodeCity(city: string, country = "France") {
  const query = encodeURIComponent(`${city}, ${country}`);

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
  );

  if (!response.ok) {
    throw new Error("Impossible de géocoder cette ville.");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Ville introuvable.");
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}