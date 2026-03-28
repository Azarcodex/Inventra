import React from "react";
import { ForecastTable } from "@/components/forecasting/ForecastTable";

export const metadata = {
  title: "Smart Forecasting - Inventra",
};

export default function ForecastingPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Smart Forecasting <span className="text-3xl">🔮</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-lg max-w-2xl">
            Predictive stock replenishment based on real-time sales velocity, standard deviations, and lead times.
          </p>
        </div>
      </header>

      <section>
        <ForecastTable />
      </section>
    </div>
  );
}
