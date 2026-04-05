"use client";

import React, { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-sidebar-bg h-screen flex flex-col p-5 shadow-2xl transition-all duration-300
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-24" : "lg:w-68"}
        `}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-3 text-slate-400 hover:text-white transition-colors"
          aria-label="Close Sidebar"
        >
          <X size={24} />
        </button>

        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 bg-indigo-600 text-white p-1 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-30 ring-4 ring-sidebar-bg items-center justify-center"
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={`mb-12 flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : "px-3"}`}>
          <div className="min-w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30 transform -rotate-3 hover:rotate-0 transition-all duration-300">
            I
          </div>
          {(!isCollapsed || isOpen) && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-bold text-white tracking-tight leading-none group cursor-default">
                Inventra<span className="text-indigo-500 group-hover:animate-pulse">.</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Smart Ops</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
          <div className="pb-2">
            {(!isCollapsed || isOpen) && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-3 animate-in fade-in duration-300">Principal</p>}
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Analytics" 
              href="/dashboard" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
            />
          </div>

          <div className="py-2">
            {(!isCollapsed || isOpen) && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-3 animate-in fade-in duration-300">Sales & Records</p>}
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="POS Terminal" 
              href="/pos" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>}
            />
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Order History" 
              href="/orders" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            />
          </div>

          <div className="py-2">
            {(!isCollapsed || isOpen) && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-3 animate-in fade-in duration-300">Stock Ops</p>}
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Inventory" 
              href="/inventory" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            />
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Supplier Network" 
              href="/suppliers" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Stock Intake" 
              href="/purchases/new" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
            />
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Purchase History" 
              href="/purchases" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            />
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="Forecast" 
              href="/forecasting" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            />
          </div>

          <div className="py-2">
            {(!isCollapsed || isOpen) && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 mb-3 animate-in fade-in duration-300">Intelligence</p>}
            <SidebarItem 
              isCollapsed={isCollapsed && !isOpen}
              label="AI Forecast" 
              href="/smart-forecast" 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
          </div>
        </nav>

        <div className={`mt-auto transition-all duration-300 ${isCollapsed ? "px-0" : "px-3"}`}>
          {/* Version removed as requested */}
        </div>
      </aside>
    </>
  );
};

