export interface SmartInsight {
  type: "weather_impact" | "weekend_surge" | "anomaly" | "general";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  affectedProducts: string[];
  suggestedAction: string;
}

export interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  rainAmount: number;
  weatherCode: number;
  condition: string;
}

export interface WeatherForecast {
  location: string;
  days: WeatherDay[];
}

export interface SmartForecastResult {
  weather: {
    summary: string;
    days: WeatherDay[];
  };
  insights: SmartInsight[];
  generatedAt: string;
}
