export async function getWeather(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
  );

  if (!response.ok) {
    throw new Error("Impossible de récupérer la météo.");
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
  };
}