"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PurchaseHistoryTable } from "@/components/purchase/PurchaseHistoryTable";

export default function PurchasesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50/30 w-full animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto py-16 px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Purchase Ledger</h1>
            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl">A historical record of all supply acquisition operations, expenses, and inventory inflow.</p>
          </div>
          
          <button 
             onClick={() => router.push("/purchases/new")}
             className="px-10 py-6 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-slate-900 hover:shadow-none hover:-translate-y-2 transition-all duration-500 active:scale-95"
          >
             + New Intake
          </button>
        </header>

        <section className="space-y-8">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Status: Operational</p>
                </div>
                <div className="flex items-center gap-10">
                   <div className="text-right">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Global Expense</p>
                       <p className="text-xl font-black text-slate-900 tracking-tight">$---</p>
                   </div>
                   <div className="text-right border-l pl-10 border-slate-100">
                       <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">30d Inflow</p>
                       <p className="text-xl font-black text-slate-900 tracking-tight">$---</p>
                   </div>
                </div>
            </div>

            <PurchaseHistoryTable />
        </section>
      </div>
    </main>
  );
}
