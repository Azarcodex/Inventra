"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAnalyticsOverview } from "@/hooks/analytics/useAnalyticsOverview";

export const HomeHub = () => {
  const { data: analytics, isLoading } = useAnalyticsOverview();
  const [greeting, setGreeting] = useState("Good Morning");
  const [time, setTime] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
    else if (hours >= 17) setGreeting("Good Evening");
    else setGreeting("Good Morning");

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-8 space-y-12 h-full flex flex-col items-center justify-center">
      {/* 🌟 Welcome / Header Section (Heroic) */}
      <header className="w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          System Operational • {time}
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">
          {greeting}, <span className="text-indigo-600">Manager.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Welcome back to <span className="font-bold text-slate-700">Inventra Enterprise</span>. Your business is running smoothly today.
        </p>
      </header>

      {/* 🚀 Primary Hub Actions (Large Professional Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl py-4">
        <HomeHubCard 
           title="POS Terminal" 
           description="Process sales, customer orders, and print receipts quickly."
           href="/pos"
           icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>}
           colorClassName="bg-indigo-600 shadow-indigo-500/30"
           delay="100"
        />
        <HomeHubCard 
           title="Inventory Management" 
           description="Manage products, track levels, and handle stock adjustments."
           href="/inventory"
           icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
           colorClassName="bg-slate-900 shadow-slate-900/30"
           delay="200"
        />
        <HomeHubCard 
           title="Advanced Analytics" 
           description="Deep-dive into sales reports and business performance metrics."
           href="/dashboard"
           icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
           colorClassName="bg-violet-600 shadow-violet-500/30"
           delay="300"
        />
      </div>

      {/* 📊 System Snapshot Section */}
      <footer className="w-full max-w-6xl pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-1000">
        <div className="flex items-center gap-12">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total Daily Revenue</p>
              <p className="text-3xl font-black text-slate-800">${analytics?.totalRevenue?.toLocaleString() || '0.00'}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Stock Alerts</p>
              <p className={`text-3xl font-black ${analytics?.lowStockCount ? 'text-rose-600' : 'text-slate-800'}`}>
                {analytics?.lowStockCount || 0} <span className="text-xs text-slate-400 font-bold ml-1 uppercase">Items Low</span>
              </p>
            </div>
        </div>

        <Link 
          href="/smart-forecast" 
          className="group relative flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-200 p-1 pl-4 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="py-2">
             <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">🧠 AI Assistant ready for insights</p>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-0.5">Explore Smart Forecasting →</p>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
        </Link>
      </footer>
    </div>
  );
};

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  colorClassName: string;
  delay: string;
}

const HomeHubCard = ({ title, description, href, icon, colorClassName, delay }: CardProps) => {
  return (
    <Link 
      href={href} 
      style={{ animationDelay: `${delay}ms` }}
      className="premium-card group relative p-8 hover:bg-slate-50 border-2 border-transparent hover:border-indigo-100/50 animate-in fade-in slide-in-from-bottom-8 duration-700 h-full"
    >
      <div className={`${colorClassName} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors font-poppins">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed mb-12">{description}</p>
      
      <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
         <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </div>
      
      <div className="w-10 h-1 bg-slate-100 rounded-full group-hover:w-full group-hover:bg-indigo-600 transition-all duration-500 absolute bottom-0 left-0" />
    </Link>
  );
};
