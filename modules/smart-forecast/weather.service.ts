import { WeatherDay, WeatherForecast } from "./smartForecast.types";

function getCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Heavy Rain";
  if (code <= 86) return "Heavy Snow";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export const weatherService = {
  // Open-Meteo is 100% free — no API key needed
  // Default coordinates: Hyderabad. Change to your city if needed.
  async getForecast(latitude = 17.385, longitude = 78.4867): Promise<WeatherForecast> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=auto&forecast_days=7`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        rainChance: data.daily.precipitation_probability_max[i],
        rainAmount: data.daily.precipitation_sum[i],
        weatherCode: data.daily.weather_code[i],
        condition: getCondition(data.daily.weather_code[i]),
      }));

      return { location: `${latitude}, ${longitude}`, days };
    } catch (error) {
      console.error("Weather API Error:", error);
      return { location: "Unknown", days: [] };
    }
  },
};
