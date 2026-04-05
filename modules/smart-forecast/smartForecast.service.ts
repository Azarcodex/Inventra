// @ts-nocheck
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { forecastingService } from "../forecasting/forecasting.service";
import { salesTrendService } from "../analytics/salesTrend/salesTrend.service";
import { weatherService } from "./weather.service";
import { SmartInsight, SmartForecastResult } from "./smartForecast.types";

export const smartForecastService = {
  async generateSmartForecast(): Promise<SmartForecastResult> {
    // 1. Gather all data sources in parallel
    const [forecasts, weather, trends] = await Promise.all([
      forecastingService.generateForecasts(30),
      weatherService.getForecast(),
      salesTrendService.getSalesTrend("7d"),
    ]);

    // 2. Build AI prompt with all context
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    const prompt = `You are an expert inventory analyst. Analyze the following data and generate actionable insights.

TODAY: ${today.toISOString().split("T")[0]} (${dayOfWeek})

INVENTORY & VELOCITY DATA:
${JSON.stringify(forecasts, null, 2)}

WEATHER FORECAST (next 7 days):
${JSON.stringify(weather.days, null, 2)}

RECENT SALES TREND (last 7 days):
${JSON.stringify(trends, null, 2)}

Based on ALL the data above, generate a JSON array of insights. Each insight must follow this exact format:
[
  {
    "type": "weather_impact" | "weekend_surge" | "anomaly" | "general",
    "severity": "info" | "warning" | "critical",
    "title": "Short headline",
    "description": "2-3 sentence explanation with specific numbers from the data",
    "affectedProducts": ["product name 1"],
    "suggestedAction": "Specific actionable recommendation"
  }
]

RULES:
- Only reference products that EXIST in the inventory data. Never invent product names.
- If inventory is empty, return a single insight saying the store has no products yet.
- Consider: rain increases umbrella/raincoat demand, heat increases cold drink/ice cream demand.
- Consider: weekends typically have 30-50% higher foot traffic than weekdays.
- Consider: if a product's daysUntilZero is less than 3, it's critical.
- Return ONLY the raw JSON array, no markdown, no explanation, no code fences.`;

    // 3. Call AI model
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      // 4. Parse AI response into structured insights
      let insights: SmartInsight[];
      try {
        const cleaned = result.text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        insights = JSON.parse(cleaned);
      } catch {
        insights = [
          {
            type: "general",
            severity: "info",
            title: "Analysis Complete",
            description: result.text,
            affectedProducts: [],
            suggestedAction: "Review your inventory manually.",
          },
        ];
      }

      return {
        weather: {
          summary: weather.days
            .slice(0, 3)
            .map((d) => `${d.date}: ${d.condition}, ${d.tempMax}°C, ${d.rainChance}% rain`)
            .join(" | "),
          days: weather.days,
        },
        insights,
        generatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        weather: {
          summary: "Weather data unavailable",
          days: weather.days,
        },
        insights: [
          {
            type: "general",
            severity: "warning",
            title: "AI Analysis Failed",
            description: error.message,
            affectedProducts: [],
            suggestedAction: "Check your GOOGLE_GENERATIVE_AI_API_KEY in .env and try again.",
          },
        ],
        generatedAt: new Date().toISOString(),
      };
    }
  },
};
