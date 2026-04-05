"use client";

import React, { useState } from "react";
import { useForecasts, ForecastMetric } from "@/hooks/forecasting/useForecasts";

export const ForecastTable = () => {
  const [days, setDays] = useState(30);
  const { data: forecasts = [], isLoading, isError } = useForecasts(days);

  const renderStatusBadge = (status: ForecastMetric["status"]) => {
    switch (status) {
      case "OUT_OF_STOCK":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 shadow-sm border border-red-200">Out of Stock</span>;
      case "CRITICAL":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 animate-pulse border border-red-100">Critical</span>;
      case "REORDER_NOW":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">Reorder Now</span>;
      case "HEALTHY":
        return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">Healthy</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-20 bg-gray-50 border-b border-gray-100"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-50 bg-white"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center font-bold shadow-sm border border-red-100">
        Failed to load stock predictions.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-gray-50/50 gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Replenishment AI</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Auto-calculates Reorder Points and Suggested Quantities.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Window:</span>
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border-gray-200 bg-white rounded-xl font-bold text-gray-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow py-2.5 px-4 outline-none cursor-pointer hover:border-gray-300"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Velocity<br/><span className="text-[9px] font-bold tracking-normal text-gray-400/70">(Sales / Day)</span></th>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">In Stock<br/><span className="text-[9px] font-bold tracking-normal text-gray-400/70">vs Reorder Pt</span></th>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Depletion<br/><span className="text-[9px] font-bold tracking-normal text-gray-400/70">Est. Days Left</span></th>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Rec. Order<br/><span className="text-[9px] font-bold tracking-normal text-gray-400/70">Quantity</span></th>
              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => {
              const stockRatio = f.reorderPoint === 0 ? 1 : f.currentStock / f.reorderPoint;
              const progressColor = stockRatio > 1.5 ? 'bg-green-400' : stockRatio >= 1 ? 'bg-amber-400' : 'bg-red-500';
              const progressWidth = Math.min(100, stockRatio * 100);

              return (
                <tr key={f.productId} className="border-b last:border-0 border-gray-50 hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-800 line-clamp-1">{f.productName}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1 tracking-wider">{f.sku}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-black text-gray-700 text-lg">{f.velocity}</span>
                    <span className="text-xs text-gray-300 font-black ml-1">/D</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-gray-900 text-lg">
                        {f.currentStock} <span className="text-sm text-gray-300 font-black">/ {f.reorderPoint}</span>
                      </span>
                      
                      <div className="w-20 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden shadow-inner flex">
                        <div 
                           className={`h-full ${progressColor} transition-all duration-1000 ease-out`} 
                           style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`font-black text-lg ${f.daysUntilZero <= 7 ? 'text-red-500' : f.daysUntilZero <= 14 ? 'text-amber-500' : 'text-gray-700'}`}>
                      {f.daysUntilZero > 365 ? "365+" : f.daysUntilZero}
                    </span>
                    <span className="text-xs text-gray-400 font-bold ml-1">DAYS</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {f.suggestedOrderQuantity > 0 ? (
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-black text-base rounded-xl inline-flex items-center shadow-sm border border-blue-100 transition-transform hover:scale-105 cursor-default">
                        +{f.suggestedOrderQuantity}
                      </span>
                    ) : (
                      <span className="text-gray-300 font-bold text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {renderStatusBadge(f.status)}
                  </td>
                </tr>
              );
            })}
            
            {forecasts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center bg-gray-50/30">
                  <div className="text-5xl mb-4 opacity-30 drop-shadow-sm">🔮</div>
                  <p className="text-gray-400 font-bold text-lg">Not enough data to generate forecasts.</p>
                  <p className="text-gray-400/70 font-medium text-sm mt-2">Try processing some more sales at the POS first!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
