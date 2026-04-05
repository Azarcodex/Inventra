"use client";

import { useSmartForecast } from "@/hooks/smart-forecast/useSmartForecast";
import { SmartInsight, WeatherDay } from "@/modules/smart-forecast/smartForecast.types";

const severityStyles: Record<string, { bg: string; border: string; icon: string }> = {
  info: { bg: "bg-blue-50", border: "border-blue-200", icon: "💡" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠️" },
  critical: { bg: "bg-red-50", border: "border-red-200", icon: "🚨" },
};

const typeLabels: Record<string, { label: string; color: string }> = {
  weather_impact: { label: "Weather Impact", color: "bg-sky-100 text-sky-800" },
  weekend_surge: { label: "Weekend Surge", color: "bg-purple-100 text-purple-800" },
  anomaly: { label: "Anomaly Detected", color: "bg-orange-100 text-orange-800" },
  general: { label: "General", color: "bg-gray-100 text-gray-800" },
};

function getWeatherEmoji(condition: string): string {
  if (condition === "Clear") return "☀️";
  if (condition === "Cloudy") return "☁️";
  if (condition.includes("Rain") || condition === "Drizzle") return "🌧️";
  if (condition === "Thunderstorm") return "⛈️";
  if (condition.includes("Snow")) return "❄️";
  if (condition === "Foggy") return "🌫️";
  return "🌤️";
}

export default function SmartForecastPage() {
  const { data, isLoading, error, refetch } = useSmartForecast();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">🧠 Smart Forecast</h1>
          <p className="text-gray-500 mt-1">
            AI-powered predictions combining your sales data + weather + trends
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isLoading ? "Analyzing..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-pulse">🧠</div>
          <p className="text-gray-500 font-medium">
            AI is analyzing your inventory + weather data...
          </p>
          <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          Failed to generate forecast. Check your API key in the .env file.
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          {/* 7-Day Weather Strip */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <h2 className="font-bold text-lg mb-3">🌤️ 7-Day Weather Outlook</h2>
            <div className="grid grid-cols-7 gap-2">
              {data.weather.days.map((day: WeatherDay) => (
                <div
                  key={day.date}
                  className="bg-white/15 rounded-xl p-3 text-center backdrop-blur-sm"
                >
                  <p className="text-xs font-bold opacity-80">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-2xl my-1">{getWeatherEmoji(day.condition)}</p>
                  <p className="text-sm font-black">{day.tempMax}°</p>
                  <p className="text-xs opacity-70">{day.rainChance}% rain</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <h2 className="font-bold text-xl mb-4">
            📊 AI Insights ({data.insights.length})
          </h2>
          <div className="space-y-4">
            {data.insights.map((insight: SmartInsight, i: number) => {
              const severity = severityStyles[insight.severity] || severityStyles.info;
              const type = typeLabels[insight.type] || typeLabels.general;

              return (
                <div
                  key={i}
                  className={`${severity.bg} ${severity.border} border rounded-2xl p-6 shadow-sm`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{severity.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          {insight.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${type.color}`}
                        >
                          {type.label}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {insight.description}
                      </p>

                      {/* Affected Products */}
                      {insight.affectedProducts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {insight.affectedProducts.map((p: string) => (
                            <span
                              key={p}
                              className="bg-white/80 border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-lg text-gray-700"
                            >
                              📦 {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Suggested Action */}
                      <div className="mt-3 bg-white/60 rounded-xl p-3 border border-gray-100">
                        <p className="text-sm font-bold text-gray-800">
                          💡 Suggested Action
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {insight.suggestedAction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-400 mt-6 text-center">
            Last analyzed: {new Date(data.generatedAt).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}
