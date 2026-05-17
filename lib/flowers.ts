export type ActiveFlower = {
  name: string;
  slug: string;
  nectar_value: number | null;
  pollen_value: number | null;
  bee_interest: number | null;
  flowering_intensity: number | null;
  start_month: number;
  end_month: number;
  peak_month: number | null;
};

export function calculateFlowerScore(
  flower: ActiveFlower,
  currentMonth: number,
  temperature?: number,
  windSpeed?: number
) {
  let score = 40;

  if (flower.peak_month === currentMonth) {
    score += 25;
  }

  if (flower.nectar_value) {
    score += flower.nectar_value * 5;
  }

  if (flower.bee_interest) {
    score += flower.bee_interest * 4;
  }

  if (temperature && temperature >= 16 && temperature <= 30) {
    score += 15;
  }

  if (windSpeed !== undefined && windSpeed < 20) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}