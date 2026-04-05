"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { usePurchase } from "@/hooks/purchase/usePurchase";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PurchaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: purchase, isLoading } = usePurchase(id);

  if (isLoading) return (
    <div className="p-20 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-xs font-normal uppercase tracking-widest text-slate-400">Loading Manifest...</p>
    </div>
  );

  if (!purchase) return (
    <div className="p-20 text-center space-y-4">
       <p className="text-xl font-normal text-slate-900">Archived Record Not Found</p>
       <button onClick={() => router.push("/purchases")} className="text-indigo-600 font-normal hover:underline">Return to Ledger</button>
    </div>
  );

  const stats = {
    totalItems: purchase.items.reduce((sum: number, i: any) => sum + i.quantity, 0),
    uniqueSkus: purchase.items.length,
    avgCost: purchase.totalAmount / purchase.items.reduce((sum: number, i: any) => sum + i.quantity, 0)
  };

  return (
    <main className="min-h-screen bg-slate-50/30 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto py-12 px-8 space-y-12">
        {/* Navigation & Actions */}
        <header className="flex items-center justify-between">
            <button 
                onClick={() => router.push("/purchases")}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-900 hover:text-white transition-all"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-[10px] font-normal uppercase tracking-widest">Back to Ledger</span>
            </button>
            <div className="flex gap-4">
                <button onClick={() => window.print()} className="px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-[10px] font-normal uppercase tracking-widest hover:bg-slate-50 transition-all">Print Voucher</button>
                <button onClick={() => toast.success("Ledger entry shared.")} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 text-[10px] font-normal uppercase tracking-widest hover:bg-slate-900 transition-all">Share Manifest</button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ⬅️ Left: Primary Info Dashboard */}
            <div className="lg:col-span-2 space-y-10">
                <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-normal uppercase tracking-widest rounded-full">Official Receipt</span>
                                <span className="text-[10px] font-normal text-slate-400 font-mono">#{purchase.id.split("-")[0]}</span>
                             </div>
                             <h1 className="text-5xl font-normal text-slate-900 tracking-tighter">{purchase.referenceNo || "Direct Intake"}</h1>
                             <p className="text-slate-400 font-medium text-sm">Synchronized on {format(new Date(purchase.createdAt), "MMMM do, yyyy")}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[11px] font-normal uppercase text-slate-400 tracking-widest mb-1">Total disbursement</p>
                             <p className="text-6xl font-normal text-indigo-600 tracking-tighter">${purchase.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Total Units</p>
                            <p className="text-2xl font-normal text-slate-900">{stats.totalItems}</p>
                        </div>
                        <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Unique SKUs</p>
                            <p className="text-2xl font-normal text-slate-900">{stats.uniqueSkus}</p>
                        </div>
                        <div className="space-y-1 border-l border-slate-200/50 pl-8">
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Avg Unit Cost</p>
                            <p className="text-2xl font-normal text-slate-900">${stats.avgCost.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <header className="flex items-center justify-between px-2">
                             <p className="text-[11px] font-normal uppercase tracking-[0.2em] text-slate-400">Acquisition Details</p>
                             <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">{purchase.items.length} Line Items</p>
                        </header>
                        <div className="overflow-hidden rounded-3xl border border-slate-50">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-widest text-slate-400">Product Specification</th>
                                        <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-widest text-slate-400 text-center">Qty</th>
                                        <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-widest text-slate-400 text-right">Unit Price</th>
                                        <th className="px-8 py-5 text-[10px] font-normal uppercase tracking-widest text-slate-400 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {purchase.items.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <p className="font-normal text-slate-900 text-sm tracking-tight">{item.product.name}</p>
                                                <p className="text-[10px] font-normal text-slate-400 font-mono uppercase tracking-widest mt-0.5">{item.product.sku || "NO_SKU"}</p>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="font-normal text-slate-700 text-sm">{item.quantity}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="font-normal text-slate-600 text-sm">${item.costPrice.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-normal text-slate-900 text-sm">
                                                ${(item.quantity * item.costPrice).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

            {/* ➡Right: Supplier Sidebar */}
            <div className="space-y-10">
                 <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl space-y-8">
                    <header className="space-y-1">
                        <p className="text-[10px] font-normal uppercase text-indigo-600 tracking-widest">Supplier Profile</p>
                        <h3 className="text-2xl font-normal text-slate-900 tracking-tight">{purchase.supplier.name}</h3>
                    </header>

                    <div className="space-y-6">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">GST/Tax Information</p>
                            <p className="font-normal text-slate-700 text-sm">{purchase.supplier.gstNumber || "Not Registered"}</p>
                        </div>
                        <div className="space-y-4 px-2">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                                <div><p className="text-[9px] font-normal uppercase text-slate-400">Contact Person</p><p className="text-xs font-normal text-slate-900">{purchase.supplier.contactPerson || "N/A"}</p></div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                                <div className="truncate"><p className="text-[9px] font-normal uppercase text-slate-400">Email Address</p><p className="text-xs font-normal text-slate-900 truncate">{purchase.supplier.email || "N/A"}</p></div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                                <div><p className="text-[9px] font-normal uppercase text-slate-400">Mobile/Office</p><p className="text-xs font-normal text-slate-900">{purchase.supplier.phone || "N/A"}</p></div>
                             </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-normal uppercase tracking-widest text-slate-400">
                             <span>Payment Status</span>
                             <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{purchase.status}</span>
                        </div>
                        <p className="text-[10px] italic text-slate-400 leading-relaxed font-medium">Terms: {purchase.supplier.paymentTerms || "Standard settlement cycle."}</p>
                    </div>
                 </section>

                 <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white space-y-4 shadow-[0_30px_60px_rgba(79,70,229,0.3)]">
                    <h4 className="font-normal text-xl tracking-tight">Ledger Insights</h4>
                    <p className="text-indigo-100 text-xs leading-relaxed font-medium opacity-80">This restock has increased your inventory valuation by ${purchase.totalAmount.toLocaleString()} and synchronized cost prices for {purchase.items.length} SKUs.</p>
                 </section>
            </div>
        </div>
      </div>
    </main>
  );
}
