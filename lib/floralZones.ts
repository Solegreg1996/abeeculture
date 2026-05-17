export function getFloralZone(
  latitude: number | null,
  longitude: number | null
) {
  if (!latitude || !longitude) {
    return "France";
  }

  if (latitude < 44.8 && longitude > 2) {
    return "Mediterranee";
  }

  if (latitude > 45.5 && longitude > 5.5) {
    return "Montagne";
  }

  if (longitude < -1) {
    return "Atlantique";
  }

  if (latitude > 48) {
    return "Nord";
  }

  if (longitude > 5) {
    return "Continental";
  }

  return "Plaine";
}

export function getFloralZoneLabel(zone: string) {
  const labels: Record<string, string> = {
    France: "France",
    Mediterranee: "Méditerranée",
    Atlantique: "Atlantique",
    Nord: "Nord",
    Montagne: "Montagne",
    Plaine: "Plaine agricole",
    Continental: "Continental",
  };

  return labels[zone] || zone;
}