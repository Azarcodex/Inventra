"use client";

import React from "react";
import { format } from "date-fns";

interface PurchaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: any | null;
}

export const PurchaseDetailsModal = ({ isOpen, onClose, purchase }: PurchaseDetailsModalProps) => {
  if (!isOpen || !purchase) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in zoom-in duration-300">
        <header className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Restock Manifest</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{purchase.referenceNo || "Ledger Entry"}</h2>
                <p className="text-xs font-medium text-slate-400">Captured on {format(new Date(purchase.createdAt), "MMMM do, yyyy 'at' h:mm a")}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white rounded-full shadow-sm hover:bg-slate-900 hover:text-white transition-all text-slate-400 group">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </header>

        <div className="p-10 space-y-8">
            <section className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-indigo-400">Source Vendor</p>
                    <p className="font-bold text-slate-900 leading-none">{purchase.supplier.name}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[10px] font-black uppercase text-indigo-400">Total Disbursement</p>
                    <p className="text-2xl font-black text-indigo-600 leading-none">${purchase.totalAmount.toLocaleString()}</p>
                </div>
            </section>

            <section className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Acquired SKUs ({purchase.items.length})</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {purchase.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                                   {item.product.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm tracking-tight">{item.product.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900 text-sm">${(item.quantity * item.costPrice).toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${item.costPrice} / unit</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        <footer className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-white border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all active:scale-95"
            >
                Close View
            </button>
            <button 
                onClick={() => window.print()} 
                className="flex-1 py-4 rounded-2xl bg-indigo-600 font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-indigo-100 hover:bg-slate-900 hover:shadow-none transition-all active:scale-95"
            >
                Print Voucher
            </button>
        </footer>
      </div>
    </div>
  );
};
