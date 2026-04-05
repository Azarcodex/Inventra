// @ts-nocheck
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { prisma } from "@/lib/db/prisma";
import { forecastingService } from "@/modules/forecasting/forecasting.service";
import { salesTrendService } from "@/modules/analytics/salesTrend/salesTrend.service";

// Keywords that indicate the question is about inventory/business
const INVENTORY_KEYWORDS = [
  "stock", "product", "inventory", "sell", "selling", "sold", "sale", "sales",
  "revenue", "order", "reorder", "forecast", "predict", "price", "profit",
  "shelf", "buffer", "lead time", "velocity", "depletion", "run out",
  "available", "shortage", "supply", "demand", "purchase", "buy",
  "quantity", "unit", "item", "milk", "bread", "store", "warehouse",
  "low", "high", "critical", "healthy", "restock", "replenish",
  "today", "yesterday", "week", "month", "trend", "growth",
  "dead stock", "slow moving", "fast moving", "top", "worst", "best",
  "how many", "how much", "what do i need", "what should i",
  "my", "our", "we", "i have", "do we have", "is there",
];

function isInventoryRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return INVENTORY_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the user's latest message
    const lastMessage = messages[messages.length - 1]?.content || "";

    // 🛡️ Guard: If the question is NOT about inventory, reject it instantly without calling AI
    if (!isInventoryRelated(lastMessage)) {
      return Response.json({
        text: "I am Inventra Co-pilot 🤖 I can only help with questions about your inventory, stock levels, and sales data. Try asking me things like:\n\n• \"Is milk available?\"\n• \"Which products are running low?\"\n• \"Why is revenue lower today?\""
      });
    }

    // Load live data from database
    const forecasts = await forecastingService.generateForecasts(30);
    const trends = await salesTrendService.getSalesTrend("7d");

    const inventoryContext = forecasts && forecasts.length > 0 ? JSON.stringify(forecasts, null, 2) : "NO INVENTORY DATA YET. THE STORE IS EMPTY.";
    const trendsContext = trends && trends.length > 0 ? JSON.stringify(trends, null, 2) : "NO REVENUE DATA YET. ZERO SALES.";

    const systemPrompt = `You are Inventra Co-pilot, an expert AI assistant for the Inventra inventory management system.
    Answer the user's question using ONLY the real-time business data below. Be concise and helpful.
    
    INVENTORY & FORECASTS:
    ${inventoryContext}
    
    REVENUE TRENDS (last 7 days):
    ${trendsContext}
    
    RULES:
    - If data is empty, tell the user to add products and make sales first.
    - Never invent product names or numbers. Only use what you see above.
    - Format cleanly with short paragraphs.`;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages,
      system: systemPrompt,
    });

    return Response.json({ text: result.text });
  } catch (error: any) {
    return Response.json({ text: "Error connecting to AI: " + error.message });
  }
}
