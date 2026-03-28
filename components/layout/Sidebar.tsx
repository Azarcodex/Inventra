"use client";

import React from "react";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 h-screen flex flex-col p-4 shadow-xl border-r border-gray-800">
      <div className="mb-10 px-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">
          I
        </div>
        <h1 className="text-xl font-black text-white tracking-tight italic">
          Inventra
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem label="Analytics Dashboard" href="/dashboard" />
        <SidebarItem label="Inventory" href="/inventory" />
        <SidebarItem label="Point of Sale" href="/pos" />
        <SidebarItem label="Order History" href="/orders" />
        <SidebarItem label="Smart Forecasting" href="/forecasting" />
        <SidebarItem label="🧠 Smart Forecast" href="/smart-forecast" />
      </nav>

      <div className="mt-auto border-t border-gray-800 pt-4 px-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
          Version 1.0.4
        </p>
      </div>
    </aside>
  );
};
