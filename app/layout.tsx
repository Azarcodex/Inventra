"use client";

import React, { useState } from "react";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CopilotWidget } from "@/components/copilot/CopilotWidget";
import { Poppins } from "next/font/google";
import { Menu } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} bg-slate-50 text-slate-900 antialiased`}>
        <Toaster richColors position="top-right" />
        <QueryProvider>
          <div className="flex h-screen overflow-hidden relative">
            {/* 📱 Mobile Top Nav */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar-bg flex items-center justify-between px-6 z-40 shadow-xl border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-sm">
                  I
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">Inventra</h1>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Open Sidebar"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Sidebar with state and toggle logic */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
              <button 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close Sidebar"
              />
            )}

            <main className="flex-1 overflow-auto bg-gray-50 pt-16 lg:pt-0">
              {children}
            </main>
          </div>
          <CopilotWidget />
        </QueryProvider>
      </body>
    </html>
  );
}

